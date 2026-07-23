"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Plane, 
  MessageSquare, 
  ClipboardList, 
  Headset, 
  Award, 
  CalendarRange, 
  Edit, 
  AlertTriangle, 
  XCircle,
  CalendarX, 
  ChevronDown, 
  Compass, 
  Files, 
  CheckCircle,
  Zap,
  HeartHandshake,
  Dog,
  Cat,
  ClipboardCheck,
  Clock,
  ArrowRight,
  Check,
  UserCheck,
  User,
  HelpCircle,
  Info,
  Menu,
  X,
  ChevronRight,
  Globe2
} from "lucide-react";

// ==========================================
// TYPES & SCHEMAS
// ==========================================
interface FormData {
  nomeTutor: string;
  emailOuTelefone: string;
  phoneCountry: CountryCode;
  tipoPet: "Cão" | "Gato" | "";
  racaPet: string;
  procedimentosVeterinarios: string[];
  paisDestino: string;
  paisDestinoOutro: string;
  dataViagem: string;
  cidadeOrigem: string;
  emailOpcional: string;
  maisDeUmPet: boolean;
  quantidadePets: string;
  qtdGatos: number;
  qtdCachorros: number;
}

interface FormErrors {
  nomeTutor?: string;
  emailOuTelefone?: string;
  racaPet?: string;
  procedimentosVeterinarios?: string;
  paisDestino?: string;
  paisDestinoOutro?: string;
  dataViagem?: string;
  tipoPet?: string;
  cidadeOrigem?: string;
  emailOpcional?: string;
  quantidadePets?: string;
}

type AnalyticsParams = Record<string, string | number | boolean | string[] | null | undefined>;
type EnhancedConversionUserData = {
  email?: string;
  phone_number?: string;
};

type NormalizedPhone = {
  e164: string;
  digits: string;
  country?: string;
  countryCallingCode: string;
  international: string;
  national: string;
};

const formCookieName = "cvi_facil_form_state";
const defaultFormData: FormData = {
  nomeTutor: "",
  emailOuTelefone: "",
  phoneCountry: "BR",
  tipoPet: "",
  racaPet: "",
  procedimentosVeterinarios: [],
  paisDestino: "",
  paisDestinoOutro: "",
  dataViagem: "",
  cidadeOrigem: "",
  emailOpcional: "",
  maisDeUmPet: false,
  quantidadePets: "",
  qtdGatos: 0,
  qtdCachorros: 0,
};

type PersistedFormState = {
  formData?: Partial<FormData>;
  formStep?: number;
  submittedWhatsAppUrl?: string;
};

type LeadDatabasePayload = {
  id: string;
  submitted_at: string;
  nome_tutor: string;
  whatsapp: string;
  whatsapp_e164: string | null;
  whatsapp_country: string | null;
  whatsapp_country_code: string | null;
  whatsapp_international: string | null;
  email_opcional: string | null;
  cidade_origem: string;
  pais_destino: string;
  pais_destino_outro: string | null;
  destino_final: string;
  data_viagem: string;
  qtd_gatos: number;
  qtd_cachorros: number;
  total_pets: number;
  pet_summary: string;
  mais_de_um_pet: boolean;
  tipo_pet: string;
  raca_pet: string | null;
  procedimentos_veterinarios: string[];
  procedimentos_veterinarios_texto: string | null;
  page_url: string | null;
  user_agent: string | null;
  tracking_params?: Record<string, string>;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  gbraid?: string;
  wbraid?: string;
  dclid?: string;
  msclkid?: string;
  ttclid?: string;
  twclid?: string;
  rdt_cid?: string;
  igshid?: string;
  ctwa_clid?: string;
  irclickid?: string;
  epik?: string;
  wamid?: string;
  tintim_fbid?: string;
  src?: string;
  sck?: string;
  utm_date?: string;
  tt_lead_id?: string;
  tt_session_id?: string;
};

const trackingParamKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "wbraid",
  "gbraid",
  "dclid",
  "ttclid",
  "twclid",
  "rdt_cid",
  "igshid",
  "ctwa_clid",
  "msclkid",
  "irclickid",
  "epik",
  "wamid",
  "tintim_fbid",
  "src",
  "sck",
  "utm_date",
  "tt_lead_id",
  "tt_session_id",
] as const;

const trackingStorageKeys = [
  "cvi_facil_tracking_params",
  "cvi_tracking_params",
  "tracking_params",
  "utm_params",
] as const;

function collectUrlParams() {
  if (typeof window === "undefined") return {};

  const searchParams = new URLSearchParams(window.location.search);
  const urlParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (value) urlParams[key] = value;
  });
  return urlParams;
}

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

function pickTrackingParams(source: Record<string, unknown> | null) {
  if (!source) return {};

  return trackingParamKeys.reduce<Record<string, string>>((trackingParams, key) => {
    const value = source[key];
    if (typeof value === "string" && value.trim()) trackingParams[key] = value.trim();
    if (typeof value === "number" && Number.isFinite(value)) trackingParams[key] = String(value);
    return trackingParams;
  }, {});
}

function parseStoredTrackingValue(value: string | null) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }

  return null;
}

function readTrackingParamsFromCookie() {
  const directTracking = trackingParamKeys.reduce<Record<string, string>>((trackingParams, key) => {
    const value = getCookieValue(key);
    if (value) trackingParams[key] = value;
    return trackingParams;
  }, {});

  const storedTracking = trackingStorageKeys.reduce<Record<string, string>>((trackingParams, key) => {
    return { ...trackingParams, ...pickTrackingParams(parseStoredTrackingValue(getCookieValue(key))) };
  }, {});

  return { ...storedTracking, ...directTracking };
}

function readTrackingParamsFromStorage(storage: Storage | undefined) {
  if (!storage) return {};

  try {
    const directTracking = trackingParamKeys.reduce<Record<string, string>>((trackingParams, key) => {
      const value = storage.getItem(key);
      if (value) trackingParams[key] = value;
      return trackingParams;
    }, {});

    const storedTracking = trackingStorageKeys.reduce<Record<string, string>>((trackingParams, key) => {
      return { ...trackingParams, ...pickTrackingParams(parseStoredTrackingValue(storage.getItem(key))) };
    }, {});

    return { ...storedTracking, ...directTracking };
  } catch {
    return {};
  }
}

function persistTrackingParams(params: Record<string, string>) {
  if (typeof window === "undefined" || Object.keys(params).length === 0) return;

  const serialized = JSON.stringify(params);
  document.cookie = `cvi_facil_tracking_params=${encodeURIComponent(serialized)}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;

  try {
    window.localStorage.setItem("cvi_facil_tracking_params", serialized);
    window.sessionStorage.setItem("cvi_facil_tracking_params", serialized);
    Object.entries(params).forEach(([key, value]) => {
      window.localStorage.setItem(key, value);
      window.sessionStorage.setItem(key, value);
    });
  } catch {
    // Storage can be blocked by privacy settings; cookie/raw payload still cover the lead.
  }
}

function getUrlTrackingParams() {
  if (typeof window === "undefined") return {};

  const urlParams = collectUrlParams();
  const currentTrackingParams = pickTrackingParams(urlParams);
  const sessionTrackingParams = readTrackingParamsFromStorage(window.sessionStorage);
  const localTrackingParams = readTrackingParamsFromStorage(window.localStorage);
  const cookieTrackingParams = readTrackingParamsFromCookie();
  const prioritizedKnownParams = {
    ...currentTrackingParams,
    ...sessionTrackingParams,
    ...localTrackingParams,
    ...cookieTrackingParams,
  };
  persistTrackingParams(prioritizedKnownParams);

  return {
    ...prioritizedKnownParams,
    tracking_params: {
      ...urlParams,
      ...currentTrackingParams,
      ...sessionTrackingParams,
      ...localTrackingParams,
      ...cookieTrackingParams,
    },
  };
}

function readPersistedFormState(): PersistedFormState | null {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${formCookieName}=`));

  if (!cookie) return null;

  try {
    return JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("="))) as PersistedFormState;
  } catch {
    return null;
  }
}

function persistFormState(state: PersistedFormState) {
  if (typeof document === "undefined") return;

  const maxAgeInSeconds = 60 * 60 * 24 * 30;
  document.cookie = `${formCookieName}=${encodeURIComponent(JSON.stringify(state))}; path=/; max-age=${maxAgeInSeconds}; SameSite=Lax`;
}

function createLeadId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (character) => {
    const randomValue = typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? crypto.getRandomValues(new Uint8Array(1))[0]
      : Math.floor(Math.random() * 256);

    return (Number(character) ^ (randomValue & (15 >> (Number(character) / 4)))).toString(16);
  });
}

function normalizePhone(value: string, defaultCountry: CountryCode = "BR"): NormalizedPhone | null {
  const rawValue = value.trim();
  if (!rawValue || rawValue.includes("@")) return null;

  const normalizedDigits = normalizePhoneNumberDigits(rawValue, defaultCountry);
  const phone = normalizedDigits
    ? parsePhoneNumberFromString(`+${normalizedDigits}`)
    : rawValue.startsWith("+")
      ? parsePhoneNumberFromString(rawValue)
      : parsePhoneNumberFromString(rawValue, defaultCountry);

  if (!phone || !phone.isPossible()) return null;

  return {
    e164: phone.number,
    digits: phone.number.replace(/\D/g, ""),
    country: phone.country,
    countryCallingCode: phone.countryCallingCode,
    international: phone.formatInternational(),
    national: phone.formatNational(),
  };
}

function formatPetQuantity(quantity: number, singular: string, plural: string) {
  if (quantity === 1) return `1 ${singular}`;
  return `${quantity} ${plural}`;
}

function clearPersistedFormState() {
  if (typeof document === "undefined") return;

  document.cookie = `${formCookieName}=; path=/; max-age=0; SameSite=Lax`;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

// ==========================================
// OFFICIAL WHATSAPP ICON (HIGH FIDELITY)
// ==========================================
const WhatsAppIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type EmbarkTestimonial = {
  quote: string;
  name: string;
  route: string;
  source: "google" | "ra";
};

const embarkTestimonialsTop: EmbarkTestimonial[] = [
  { quote: "A CVI Fácil foi essencial para nossa viagem. Explicaram tudo e nos acompanharam em cada etapa.", name: "Juliana T. e Theo", route: "Porto Alegre - RS -> Portugal", source: "google" },
  { quote: "Equipe incrível! Meu pet viajou para a Espanha sem nenhum problema. Super recomendo!", name: "Rafael A. e Lilo", route: "São Paulo - SP -> Espanha", source: "ra" },
  { quote: "Atendimento rápido, claro e muito atencioso. Viagem tranquila e sem imprevistos.", name: "Camila M. e Mel", route: "Curitiba - PR -> EUA", source: "google" },
  { quote: "Foram muito claros sobre prazos e documentos. Chegamos tranquilos no aeroporto.", name: "Patrícia R. e Nina", route: "Brasília - DF -> França", source: "google" },
];

const embarkTestimonialsBottom: EmbarkTestimonial[] = [
  { quote: "Estava muito insegura com as regras da Alemanha, mas a equipe me acalmou e resolveu tudo com perfeição.", name: "Mariana S. e Pipoca", route: "Belo Horizonte - MG -> Alemanha", source: "ra" },
  { quote: "Profissionais nota 10. Indico para qualquer tutor que queira viajar sem estresse ou medo.", name: "Guilherme F. e Marley", route: "Rio de Janeiro - RJ -> Canadá", source: "google" },
  { quote: "Não imaginava que o processo poderia ser tão simples. Valeu cada centavo pelo suporte prestado.", name: "Beatriz L. e Luna", route: "Florianópolis - SC -> Itália", source: "ra" },
  { quote: "Acompanharam cada detalhe e responderam tudo com paciência. Foi um alívio enorme.", name: "Renato P. e Bob", route: "Salvador - BA -> Portugal", source: "google" },
];

const embarkTestimonialsTopLoop = [...embarkTestimonialsTop, ...embarkTestimonialsTop];
const embarkTestimonialsBottomLoop = [...embarkTestimonialsBottom, ...embarkTestimonialsBottom];

const destinationOptions = [
  { value: "Estados Unidos", label: "Estados Unidos", flagCode: "us", hint: "Destino comum para cães e gatos" },
  { value: "Portugal", label: "Portugal", flagCode: "pt", hint: "Viagens frequentes saindo do Brasil" },
  { value: "Mercosul", label: "Mercosul", flagCode: "mercosul", hint: "Argentina, Uruguai, Paraguai e região" },
  { value: "União Europeia", label: "União Europeia", flagCode: "eu", hint: "França, Espanha, Itália e outros países" },
  { value: "Reino Unido", label: "Reino Unido", flagCode: "uk", hint: "Exigências específicas para entrada" },
  { value: "Canadá", label: "Canadá", flagCode: "ca", hint: "Documentos e prazos revisados" },
  { value: "Outro", label: "Outro país", flagCode: "other", hint: "Avaliamos o destino com você" },
];

const phoneCountryOptions: { iso: CountryCode; label: string; dialCode: string; flagCode: string }[] = [
  { iso: "BR", label: "Brasil", dialCode: "+55", flagCode: "br" },
  { iso: "PT", label: "Portugal", dialCode: "+351", flagCode: "pt" },
  { iso: "US", label: "Estados Unidos", dialCode: "+1", flagCode: "us" },
  { iso: "CA", label: "Canadá", dialCode: "+1", flagCode: "ca" },
  { iso: "GB", label: "Reino Unido", dialCode: "+44", flagCode: "uk" },
  { iso: "CO", label: "Colômbia", dialCode: "+57", flagCode: "co" },
  { iso: "ES", label: "Espanha", dialCode: "+34", flagCode: "es" },
  { iso: "IT", label: "Itália", dialCode: "+39", flagCode: "it" },
  { iso: "FR", label: "França", dialCode: "+33", flagCode: "fr" },
  { iso: "DE", label: "Alemanha", dialCode: "+49", flagCode: "de" },
  { iso: "AR", label: "Argentina", dialCode: "+54", flagCode: "ar" },
  { iso: "UY", label: "Uruguai", dialCode: "+598", flagCode: "uy" },
  { iso: "PY", label: "Paraguai", dialCode: "+595", flagCode: "py" },
  { iso: "PE", label: "Peru", dialCode: "+51", flagCode: "pe" },
  { iso: "MX", label: "México", dialCode: "+52", flagCode: "mx" },
  { iso: "CL", label: "Chile", dialCode: "+56", flagCode: "cl" },
  { iso: "AU", label: "Austrália", dialCode: "+61", flagCode: "au" },
  { iso: "JP", label: "Japão", dialCode: "+81", flagCode: "jp" },
];

const veterinaryProcedureOptions = ["Microchip", "Vacina", "Exame de Sorologia"];
const noVeterinaryProcedureOption = "Nenhum procedimento realizado";

function keepOnlyLettersAndSpaces(value: string) {
  return value.replace(/[^\p{L}\s]/gu, "").replace(/\s{2,}/g, " ");
}

const ddiLengthConfig: Record<string, number[]> = {
  "55": [8, 9, 10, 11],
  "1": [10],
  "351": [9],
  "44": [10],
  "52": [10],
  "57": [10],
  "34": [9],
  "33": [9],
  "49": [10, 11, 12],
  "39": [10],
  "54": [10],
  "56": [9],
  "51": [9],
  "595": [9],
  "598": [8, 9],
  "61": [9],
  "81": [10],
};

function getPhoneOptionByIso(country: CountryCode) {
  return phoneCountryOptions.find((option) => option.iso === country) ?? phoneCountryOptions[0];
}

function inferPhoneCountryFromTypedDdi(value: string, currentCountry: CountryCode): CountryCode | null {
  const trimmedValue = value.trim();
  const isInternationalFormat = trimmedValue.startsWith("+") || trimmedValue.startsWith("00");
  if (!isInternationalFormat) return null;

  const digits = trimmedValue.replace(/\D/g, "").replace(/^00/, "");
  if (!digits) return null;

  const matches = phoneCountryOptions
    .filter((option) => digits.startsWith(option.dialCode.replace(/\D/g, "")))
    .sort((a, b) => b.dialCode.length - a.dialCode.length);

  if (!matches.length) return null;

  return matches.find((option) => option.iso === currentCountry)?.iso ?? matches[0].iso;
}

function inferPhoneCountryByTimezone(): CountryCode | null {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const language = (navigator.language || "").toLowerCase();

    if (
      timeZone.startsWith("America/Sao_Paulo") ||
      timeZone.startsWith("America/Bahia") ||
      timeZone.startsWith("America/Fortaleza") ||
      timeZone.startsWith("America/Maceio") ||
      timeZone.startsWith("America/Recife") ||
      timeZone.startsWith("America/Belem") ||
      timeZone.startsWith("America/Manaus") ||
      timeZone.startsWith("America/Cuiaba") ||
      timeZone.startsWith("America/Campo_Grande") ||
      timeZone.startsWith("America/Rio_Branco") ||
      timeZone.startsWith("America/Santarem") ||
      timeZone.startsWith("America/Boa_Vista") ||
      timeZone.startsWith("America/Araguaina") ||
      timeZone.startsWith("America/Porto_Velho")
    ) return "BR";

    if (timeZone.startsWith("Europe/Lisbon") || timeZone.startsWith("Atlantic/Madeira") || timeZone.startsWith("Atlantic/Azores")) return "PT";
    if (timeZone.startsWith("America/Mexico_City") || timeZone.startsWith("America/Cancun") || timeZone.startsWith("America/Monterrey")) return "MX";
    if (timeZone.startsWith("America/Bogota")) return "CO";
    if (timeZone.startsWith("America/New_York") || timeZone.startsWith("America/Chicago") || timeZone.startsWith("America/Los_Angeles") || timeZone.startsWith("America/Denver")) return "US";
    if (timeZone.startsWith("America/Toronto") || timeZone.startsWith("America/Vancouver")) return "CA";
    if (timeZone.startsWith("Europe/London")) return "GB";
    if (timeZone.startsWith("Europe/Madrid")) return "ES";
    if (timeZone.startsWith("Europe/Rome")) return "IT";
    if (timeZone.startsWith("Europe/Paris")) return "FR";
    if (timeZone.startsWith("Europe/Berlin")) return "DE";
    if (timeZone.startsWith("America/Argentina") || timeZone.startsWith("America/Buenos_Aires")) return "AR";
    if (timeZone.startsWith("America/Montevideo")) return "UY";
    if (timeZone.startsWith("America/Asuncion")) return "PY";
    if (timeZone.startsWith("America/Lima")) return "PE";
    if (timeZone.startsWith("America/Santiago")) return "CL";
    if (timeZone.startsWith("Australia/")) return "AU";
    if (timeZone.startsWith("Asia/Tokyo")) return "JP";

    if (language.includes("pt-br")) return "BR";
    if (language.includes("pt-pt")) return "PT";
    if (language.includes("es-mx")) return "MX";
    if (language.includes("es-co")) return "CO";
    if (language.includes("en-us")) return "US";
    if (language.includes("en-ca")) return "CA";
  } catch {
    return null;
  }

  return null;
}

function detectDefaultPhoneCountry(): CountryCode {
  if (typeof navigator === "undefined") return "BR";

  const language = navigator.language || "";
  const countryFromLocale = language.includes("-") ? language.split("-").pop()?.toUpperCase() : "";
  const localeMatch = phoneCountryOptions.find((option) => option.iso === countryFromLocale);
  if (localeMatch) return localeMatch.iso;

  return inferPhoneCountryByTimezone() ?? "BR";
}

function normalizePhoneNumberDigits(rawPhone: string, manualCountry: CountryCode) {
  if (!rawPhone) return "";

  const digits = rawPhone.replace(/\D/g, "");
  const hasPlus = rawPhone.trim().startsWith("+");
  if (digits.length < 8) return "";
  if (hasPlus) return digits;

  const selectedOption = getPhoneOptionByIso(manualCountry);
  const baseCountryCode = selectedOption.dialCode.replace(/\D/g, "");
  const localDigits = digits.startsWith("0") ? digits.slice(1) : digits;
  const language = typeof navigator !== "undefined" ? (navigator.language || "").toLowerCase() : "";
  const isLikelyBrRoaming = baseCountryCode === "1" && localDigits.length === 11 && (language.includes("pt") || language.includes("br"));
  const effectiveBase = isLikelyBrRoaming ? "55" : baseCountryCode;
  const effectiveConfig = ddiLengthConfig[effectiveBase];

  if (effectiveConfig?.includes(localDigits.length)) {
    return `${effectiveBase}${localDigits}`;
  }

  for (const ddi of Object.keys(ddiLengthConfig).sort((a, b) => b.length - a.length)) {
    if (!digits.startsWith(ddi)) continue;
    const localPart = digits.slice(ddi.length);
    if (ddiLengthConfig[ddi]?.includes(localPart.length)) return digits;
  }

  return digits;
}

function DestinationFlag({ code }: { code: string }) {
  const className = "h-5 w-7 overflow-hidden rounded-[4px] border border-black/10 shadow-sm";

  if (code === "br") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#009b3a" />
        <path d="M14 3 25 10 14 17 3 10 14 3Z" fill="#ffdf00" />
        <circle cx="14" cy="10" r="4.1" fill="#002776" />
        <path d="M10.2 8.7c2.5-.4 5.3.1 7.6 1.5" stroke="#fff" strokeWidth="0.8" fill="none" />
      </svg>
    );
  }

  if (code === "us") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#fff" />
        {[0, 3, 6, 9, 12, 15, 18].map((y) => (
          <rect key={y} y={y} width="28" height="1.6" fill="#b22234" />
        ))}
        <rect width="11.5" height="10.8" fill="#3c3b6e" />
        {[2, 5, 8].map((y) =>
          [2, 5.5, 9].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.55" fill="#fff" />)
        )}
      </svg>
    );
  }

  if (code === "pt") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="11" height="20" fill="#046a38" />
        <rect x="11" width="17" height="20" fill="#da291c" />
        <circle cx="11" cy="10" r="3.1" fill="#ffcd00" />
        <circle cx="11" cy="10" r="1.8" fill="#fff" />
      </svg>
    );
  }

  if (code === "mercosul") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#0b4ea2" />
        <path d="M14 4.2 15.2 8h4l-3.2 2.3 1.2 3.7-3.2-2.3-3.2 2.3 1.2-3.7L8.8 8h4L14 4.2Z" fill="#f5c400" />
        <path d="M5 15.5c4.6-2.6 13.4-2.6 18 0" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (code === "eu") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#003399" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={14 + Math.cos(angle) * 5} cy={10 + Math.sin(angle) * 5} r="0.75" fill="#ffcc00" />;
        })}
      </svg>
    );
  }

  if (code === "uk") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#012169" />
        <path d="M0 0 28 20M28 0 0 20" stroke="#fff" strokeWidth="4" />
        <path d="M0 0 28 20M28 0 0 20" stroke="#c8102e" strokeWidth="2" />
        <path d="M14 0v20M0 10h28" stroke="#fff" strokeWidth="6" />
        <path d="M14 0v20M0 10h28" stroke="#c8102e" strokeWidth="3.4" />
      </svg>
    );
  }

  if (code === "ca") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#fff" />
        <rect width="6.5" height="20" fill="#d52b1e" />
        <rect x="21.5" width="6.5" height="20" fill="#d52b1e" />
        <path d="M14 4.2 15.1 7l2.4-1.2-.9 2.8 2.7.8-2.7 1 1.1 2.6-2.4-1.3L14 16l-1.3-4.3-2.4 1.3 1.1-2.6-2.7-1 2.7-.8-.9-2.8L12.9 7 14 4.2Z" fill="#d52b1e" />
      </svg>
    );
  }

  if (code === "es") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#aa151b" />
        <rect y="5" width="28" height="10" fill="#f1bf00" />
        <rect x="7" y="7.2" width="2.8" height="5.6" fill="#aa151b" />
      </svg>
    );
  }

  if (code === "it") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="9.33" height="20" fill="#009246" />
        <rect x="9.33" width="9.34" height="20" fill="#fff" />
        <rect x="18.67" width="9.33" height="20" fill="#ce2b37" />
      </svg>
    );
  }

  if (code === "fr") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="9.33" height="20" fill="#0055a4" />
        <rect x="9.33" width="9.34" height="20" fill="#fff" />
        <rect x="18.67" width="9.33" height="20" fill="#ef4135" />
      </svg>
    );
  }

  if (code === "de") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="6.67" fill="#000" />
        <rect y="6.67" width="28" height="6.66" fill="#dd0000" />
        <rect y="13.33" width="28" height="6.67" fill="#ffce00" />
      </svg>
    );
  }

  if (code === "ar") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#74acdf" />
        <rect y="6.67" width="28" height="6.66" fill="#fff" />
        <circle cx="14" cy="10" r="1.7" fill="#f6b40e" />
      </svg>
    );
  }

  if (code === "uy") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#fff" />
        {[2.2, 6.6, 11, 15.4].map((y) => <rect key={y} y={y} width="28" height="2.2" fill="#0038a8" />)}
        <rect width="9" height="9" fill="#fff" />
        <circle cx="4.5" cy="4.5" r="2" fill="#fcd116" />
      </svg>
    );
  }

  if (code === "py") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="6.67" fill="#d52b1e" />
        <rect y="6.67" width="28" height="6.66" fill="#fff" />
        <rect y="13.33" width="28" height="6.67" fill="#0038a8" />
      </svg>
    );
  }

  if (code === "co") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="10" fill="#fcd116" />
        <rect y="10" width="28" height="5" fill="#003893" />
        <rect y="15" width="28" height="5" fill="#ce1126" />
      </svg>
    );
  }

  if (code === "pe") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="9.33" height="20" fill="#d91023" />
        <rect x="9.33" width="9.34" height="20" fill="#fff" />
        <rect x="18.67" width="9.33" height="20" fill="#d91023" />
      </svg>
    );
  }

  if (code === "mx") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="9.33" height="20" fill="#006847" />
        <rect x="9.33" width="9.34" height="20" fill="#fff" />
        <rect x="18.67" width="9.33" height="20" fill="#ce1126" />
        <circle cx="14" cy="10" r="1.5" fill="#c09300" />
      </svg>
    );
  }

  if (code === "cl") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="10" fill="#fff" />
        <rect y="10" width="28" height="10" fill="#d52b1e" />
        <rect width="10" height="10" fill="#0039a6" />
        <path d="M5 2.4 5.7 4.3h2L6.1 5.5l.6 1.9L5 6.2 3.3 7.4l.6-1.9L2.3 4.3h2L5 2.4Z" fill="#fff" />
      </svg>
    );
  }

  if (code === "au") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#012169" />
        <path d="M20 5.5 20.6 7h1.6l-1.3 1 .5 1.5L20 8.6l-1.4.9.5-1.5-1.3-1h1.6L20 5.5Z" fill="#fff" />
        <path d="M6 3v8M2 7h8" stroke="#fff" strokeWidth="2.5" />
        <path d="M6 3v8M2 7h8" stroke="#c8102e" strokeWidth="1.2" />
      </svg>
    );
  }

  if (code === "jp") {
    return (
      <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
        <rect width="28" height="20" fill="#fff" />
        <circle cx="14" cy="10" r="4.3" fill="#bc002d" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 28 20" aria-hidden="true">
      <rect width="28" height="20" fill="#eef8fc" />
      <circle cx="14" cy="10" r="6.2" fill="none" stroke="#1182ba" strokeWidth="1.7" />
      <path d="M7.8 10h12.4M14 3.8c2 2 2 10.4 0 12.4M14 3.8c-2 2-2 10.4 0 12.4" stroke="#1182ba" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function EmbarkTestimonialCard({ testimonial }: { testimonial: EmbarkTestimonial }) {
  return (
    <div className="whitespace-normal w-full md:w-[340px] bg-white border border-gray-100 rounded-2xl p-5 shadow-[0_4px_15px_rgba(6,42,87,0.01)] shrink-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(6,42,87,0.07)]">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800] filter drop-shadow-[0_1px_2px_rgba(255,184,0,0.25)]" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.87 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
            </svg>
          ))}
        </div>
        {testimonial.source === "google" ? (
          <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
        ) : (
          <img src="/assets/logo-reclameaqui.png" alt="Reclame Aqui" className="w-5 h-5 object-contain shrink-0" />
        )}
      </div>
      <p className="text-[13px] sm:text-[13.5px] text-text-main leading-relaxed mb-4 font-medium italic">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-[12px] uppercase shrink-0">
          {testimonial.name[0]}
        </div>
        <div className="flex flex-col text-left leading-none">
          <strong className="text-[13px] font-extrabold text-navy">{testimonial.name}</strong>
          <span className="text-[11px] text-text-muted mt-1 font-semibold">{testimonial.route}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const currentYear = new Date().getFullYear();

  // Scroll effect for header
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 520);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Form states
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>(defaultFormData);

  const [hasStartedForm, setHasStartedForm] = useState(false);

  // Track event analytics helper
  const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
    console.log("[Analytics Event] " + eventName, params);
    const analyticsWindow = window as Window & {
      dataLayer?: unknown[];
    };
    if (typeof window !== "undefined") {
      analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
      analyticsWindow.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  };

  const setEnhancedConversionUserData = (userData: EnhancedConversionUserData) => {
    const cleanUserData = Object.fromEntries(
      Object.entries(userData).filter(([, value]) => Boolean(value))
    ) as EnhancedConversionUserData;

    if (Object.keys(cleanUserData).length === 0 || typeof window === "undefined") return;

    const analyticsWindow = window as Window & {
      dataLayer?: unknown[];
      cviEnhancedConversionUserData?: EnhancedConversionUserData;
    };

    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.cviEnhancedConversionUserData = cleanUserData;
    analyticsWindow.dataLayer.push({
      event: "cvi_enhanced_conversion_user_data",
      user_data: cleanUserData,
      email: cleanUserData.email,
      phone_number: cleanUserData.phone_number,
    });
  };

  // Trigger form_view on mount
  useEffect(() => {
    trackEvent("cvi_form_view", {
      form_id: "cvi_lead_form",
      form_name: "CVI Fácil Lead Form",
    });
  }, []);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.nomeTutor.trim()) newErrors.nomeTutor = "Por favor, digite seu nome";
    if (!formData.emailOuTelefone.trim()) newErrors.emailOuTelefone = "Por favor, digite seu e-mail ou telefone";
    if (!formData.paisDestino) newErrors.paisDestino = "Por favor, selecione o país de destino";
    if (!formData.dataViagem) newErrors.dataViagem = "Por favor, selecione quando pretende viajar";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveLeadToDatabase = async (leadPayload: LeadDatabasePayload) => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadPayload),
    });

    if (!response.ok) {
      throw new Error(`Lead database save failed with status ${response.status}`);
    }

    return response.json() as Promise<{ ok?: boolean; skipped?: boolean; reason?: string }>;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setIsSubmitting(true);
    const destinoFinal = formData.paisDestino === "Outro"
      ? formData.paisDestinoOutro.trim()
      : formData.paisDestino;
    const whatsappNumber = "5511942452218";
    const totalPets = formData.qtdGatos + formData.qtdCachorros;
    const petDetailParts = [];
    if (formData.qtdCachorros > 0) petDetailParts.push(formatPetQuantity(formData.qtdCachorros, "cachorro", "cachorros"));
    if (formData.qtdGatos > 0) petDetailParts.push(formatPetQuantity(formData.qtdGatos, "gato", "gatos"));
    const petDetails = petDetailParts.join(" e ");
    const analyticsContext = getFormAnalyticsContext(3);
    const leadId = createLeadId();
    const tutorName = formData.nomeTutor.trim();
    const tutorPhone = formData.emailOuTelefone.trim();
    const normalizedTutorPhone = normalizePhone(tutorPhone, formData.phoneCountry);
    const tutorPhoneDigits = normalizedTutorPhone?.digits || tutorPhone.replace(/\D/g, "");
    const tutorPhoneE164 = normalizedTutorPhone?.e164 || "";
    const tutorEmail = formData.emailOpcional.trim();
    const leadPayload: LeadDatabasePayload = {
      id: leadId,
      submitted_at: new Date().toISOString(),
      nome_tutor: tutorName,
      whatsapp: tutorPhone,
      whatsapp_e164: normalizedTutorPhone?.e164 || null,
      whatsapp_country: normalizedTutorPhone?.country || null,
      whatsapp_country_code: normalizedTutorPhone?.countryCallingCode || null,
      whatsapp_international: normalizedTutorPhone?.international || null,
      email_opcional: tutorEmail || null,
      cidade_origem: formData.cidadeOrigem.trim(),
      pais_destino: formData.paisDestino,
      pais_destino_outro: formData.paisDestino === "Outro" ? formData.paisDestinoOutro.trim() || null : null,
      destino_final: destinoFinal,
      data_viagem: formData.dataViagem,
      qtd_gatos: formData.qtdGatos,
      qtd_cachorros: formData.qtdCachorros,
      total_pets: totalPets,
      pet_summary: petDetails,
      mais_de_um_pet: totalPets > 1,
      tipo_pet: formData.tipoPet || petDetails,
      raca_pet: formData.racaPet.trim() || null,
      procedimentos_veterinarios: formData.procedimentosVeterinarios,
      procedimentos_veterinarios_texto: formData.procedimentosVeterinarios.length > 0 ? formData.procedimentosVeterinarios.join(", ") : null,
      page_url: typeof window !== "undefined" ? window.location.href : null,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
      ...getUrlTrackingParams(),
    };

    setEnhancedConversionUserData({
      email: tutorEmail || undefined,
      phone_number: tutorPhoneE164 || undefined,
    });

    trackEvent("cvi_form_submitted", { 
      ...analyticsContext,
      tipoPet: formData.tipoPet, 
      destino: destinoFinal,
      lead_id: leadId,
      user_id: leadId,
      event_id: leadId,
      tutor_name: tutorName,
      tutor_phone: tutorPhone,
      tutor_phone_digits: tutorPhoneDigits,
      tutor_phone_e164: tutorPhoneE164,
      tutor_phone_country: normalizedTutorPhone?.country || null,
      tutor_phone_country_code: normalizedTutorPhone?.countryCallingCode || null,
      tutor_email: tutorEmail,
      pet_breed: formData.racaPet.trim() || null,
      veterinary_procedures: formData.procedimentosVeterinarios,
    });

    try {
      const databaseResult = await saveLeadToDatabase(leadPayload);
      trackEvent("cvi_lead_database_saved", {
        ...analyticsContext,
        database_saved: databaseResult.ok === true,
        database_skipped: databaseResult.skipped === true,
        database_skip_reason: databaseResult.reason,
      });
    } catch (error) {
      console.error("[cvi-leads] Could not save lead", error);
      trackEvent("cvi_lead_database_error", {
        ...analyticsContext,
        database_saved: false,
      });
    }
    
    const emailText = formData.emailOpcional.trim() ? formData.emailOpcional : "Não informado";
    const breedText = formData.racaPet.trim() || "Não informado";
    const proceduresText = formData.procedimentosVeterinarios.length > 0 ? formData.procedimentosVeterinarios.join(", ") : "Nenhum procedimento informado";
    const text = `Olá, equipe CVI Fácil! Acabei de enviar meu formulário pelo site e quero antecipar meu atendimento por aqui.\n\n*Resumo da viagem:*\n- Origem: ${formData.cidadeOrigem}\n- Destino: ${destinoFinal}\n- Previsão da viagem: ${formData.dataViagem}\n\n*Pet(s):*\n- ${petDetails}\n- Raça: ${breedText}\n- Procedimentos veterinários: ${proceduresText}\n- Mais de um pet: ${totalPets > 1 ? "Sim (" + totalPets + " pets no total)" : "Não, apenas 1 pet"}\n\n*Dados do tutor:*\n- Nome: ${formData.nomeTutor}\n- WhatsApp: ${formData.emailOuTelefone}\n- E-mail: ${emailText}\n\nPodem me orientar com os próximos passos?`;
    const encodedText = encodeURIComponent(text);
    setTimeout(() => {
      setSubmittedWhatsAppUrl(`https://wa.me/${whatsappNumber}?text=${encodedText}`);
      setFormStep(4);
      setIsSubmitting(false);
    }, 800);
  };

  // FAQ states
  
  
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let targetX = -999;
    let targetY = -999;
    let currentX = -999;
    let currentY = -999;
    let animationFrameId: number;
    let isInitialized = false;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX + 14;
      targetY = e.clientY + 14;
      if (!isInitialized) {
        currentX = targetX;
        currentY = targetY;
        isInitialized = true;
      }
    };

    const updatePosition = () => {
      if (isInitialized && currentX !== -999) {
        // Linear interpolation (Lerp) for premium magnetic lagging ease follow
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        const el = tooltipRef.current;
        if (el) {
          el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  
  const riskImages = [
    "/assets/consequencia-entrada-negada.png",
    "/assets/consequencia-quarentena-forcada.png",
    "/assets/consequencia-perda-viagem.png"
  ];
  


  const [activeSection, setActiveSection] = useState("home");
  useEffect(() => {
    const handleSectionScroll = () => {
      const sections = ["home", "problemas", "comparativo", "etapas", "faq"];
      const scrollPosition = window.scrollY + 120; // offset for sticky header

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleSectionScroll);
    return () => window.removeEventListener("scroll", handleSectionScroll);
  }, []);

  const navRefs = useRef<{[key: string]: HTMLAnchorElement | null}>({});
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ opacity: 0, left: 0, width: 0 });
  const smoothScrollFrame = useRef<number | null>(null);

  const smoothScrollToTarget = useCallback((targetId: string) => {
    const element = document.getElementById(targetId);
    if (!element) return;

    if (smoothScrollFrame.current !== null) {
      window.cancelAnimationFrame(smoothScrollFrame.current);
    }

    const headerOffset = window.innerWidth < 768 ? 64 : 76;
    const startY = window.scrollY;
    const elementY = element.getBoundingClientRect().top + window.scrollY;
    const targetY = Math.max(0, elementY - headerOffset);
    const distance = targetY - startY;
    const duration = Math.min(950, Math.max(520, Math.abs(distance) * 0.45));
    const startTime = performance.now();
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutCubic(progress));

      if (progress < 1) {
        smoothScrollFrame.current = window.requestAnimationFrame(step);
      } else {
        smoothScrollFrame.current = null;
      }
    };

    smoothScrollFrame.current = window.requestAnimationFrame(step);
  }, []);

  // Symmetrical JS smooth scroll handler to guarantee zero instant jumping/teleporting
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    smoothScrollToTarget(targetId);
  };

  useEffect(() => {
    const activeEl = navRefs.current[activeSection];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle({ opacity: 0 });
    }
  }, [activeSection]);



  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [showMultiPetInfo, setShowMultiPetInfo] = useState(false);
  const [showQuantityCounters, setShowQuantityCounters] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [isPhoneCountryOpen, setIsPhoneCountryOpen] = useState(false);
  const [submittedWhatsAppUrl, setSubmittedWhatsAppUrl] = useState("");
  const destinationDropdownRef = useRef<HTMLDivElement>(null);
  const phoneCountryDropdownRef = useRef<HTMLDivElement>(null);
  const formAbandonmentTrackedRef = useRef(false);

  useEffect(() => {
    let isActive = true;

    queueMicrotask(() => {
      if (!isActive) return;

      const persistedState = readPersistedFormState();
      const persistedFormData = { ...defaultFormData, phoneCountry: detectDefaultPhoneCountry(), ...persistedState?.formData };
      const persistedStep = persistedState?.formStep;

      setFormData(persistedFormData);
      setFormStep(persistedStep && persistedStep >= 1 && persistedStep <= 3 ? persistedStep : 1);
      setShowQuantityCounters((persistedFormData.qtdGatos + persistedFormData.qtdCachorros) > 1);
      setSubmittedWhatsAppUrl(persistedState?.formStep === 4 ? "" : persistedState?.submittedWhatsAppUrl ?? "");
      setIsMounted(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const getFormAnalyticsContext = (stepOverride = formStep): AnalyticsParams => {
    const petCount = formData.qtdGatos + formData.qtdCachorros;
    const destination = formData.paisDestino === "Outro" ? formData.paisDestinoOutro.trim() : formData.paisDestino;
    const filledFields = [
      petCount > 0,
      Boolean(formData.racaPet.trim()),
      formData.procedimentosVeterinarios.length > 0,
      Boolean(formData.cidadeOrigem.trim()),
      Boolean(destination),
      Boolean(formData.dataViagem),
      Boolean(formData.nomeTutor.trim()),
      Boolean(formData.emailOuTelefone.trim()),
      Boolean(formData.emailOpcional.trim()),
    ].filter(Boolean).length;

    return {
      form_id: "cvi_lead_form",
      form_name: "CVI Fácil Lead Form",
      form_step: stepOverride,
      form_step_name: stepOverride === 1 ? "pet" : stepOverride === 2 ? "viagem" : stepOverride === 3 ? "tutor_e_contato" : "confirmacao",
      form_completed: stepOverride === 4,
      destination: destination || null,
      destination_type: formData.paisDestino || null,
      travel_window: formData.dataViagem || null,
      pet_count: petCount,
      dog_count: formData.qtdCachorros,
      cat_count: formData.qtdGatos,
      pet_breed: formData.racaPet.trim() || null,
      veterinary_procedures: formData.procedimentosVeterinarios,
      has_whatsapp: Boolean(formData.emailOuTelefone.trim()),
      has_optional_email: Boolean(formData.emailOpcional.trim()),
      filled_fields_count: filledFields,
    };
  };

  const hasMeaningfulFormProgress = () => {
    const context = getFormAnalyticsContext();
    return Number(context.filled_fields_count ?? 0) > 0;
  };

  useEffect(() => {
    if (!isMounted) return;

    trackEvent("cvi_form_step_viewed", getFormAnalyticsContext());
    // Tracking should fire once per visual step transition, not on every field edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formStep, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    if (formStep === 4) {
      formAbandonmentTrackedRef.current = true;
      return;
    }

    const trackAbandonment = () => {
      if (formAbandonmentTrackedRef.current || !hasMeaningfulFormProgress()) return;
      formAbandonmentTrackedRef.current = true;
      trackEvent("cvi_form_abandoned", {
        ...getFormAnalyticsContext(),
        abandonment_step: formStep,
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackAbandonment();
      }
    };

    window.addEventListener("pagehide", trackAbandonment);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", trackAbandonment);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // Rebind on form data changes so the abandonment payload reflects the latest answers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, formStep, isMounted]);

  const clearFieldErrors = (...fields: (keyof FormErrors)[]) => {
    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      fields.forEach((field) => delete nextErrors[field]);
      return nextErrors;
    });
  };

  useEffect(() => {
    if (!isMounted) return;

    if (formStep === 4) {
      clearPersistedFormState();
      return;
    }

    persistFormState({
      formData,
      formStep,
      submittedWhatsAppUrl,
    });
  }, [formData, formStep, submittedWhatsAppUrl, isMounted]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        event.preventDefault();
        return;
      }

      const targetId = decodeURIComponent(href.slice(1));
      if (!document.getElementById(targetId)) return;

      event.preventDefault();
      setIsMobileMenuOpen(false);
      smoothScrollToTarget(targetId);
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => document.removeEventListener("click", handleAnchorClick, true);
  }, [smoothScrollToTarget]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        destinationDropdownRef.current &&
        !destinationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDestinationOpen(false);
      }
      if (
        phoneCountryDropdownRef.current &&
        !phoneCountryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPhoneCountryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    const totalPets = formData.qtdGatos + formData.qtdCachorros;
    if (totalPets === 0) {
      newErrors.tipoPet = "Por favor, adicione pelo menos um pet (gato ou cachorro) para continuar";
    }
    if (!formData.racaPet.trim()) {
      newErrors.racaPet = "Informe a raça do pet ou marque que não tem raça definida";
    }
    if (formData.procedimentosVeterinarios.length === 0) {
      newErrors.procedimentosVeterinarios = "Selecione os procedimentos realizados ou marque nenhum procedimento";
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      trackEvent("cvi_step_1_completed", getFormAnalyticsContext(1));
    } else {
      trackEvent("cvi_form_error", {
        ...getFormAnalyticsContext(1),
        error_step: 1,
        error_fields: Object.keys(newErrors),
      });
    }
    return isValid;
  };

  const validateStep2 = () => {
    const newErrors: FormErrors = {};
    if (!formData.cidadeOrigem.trim()) {
      newErrors.cidadeOrigem = "Por favor, informe sua cidade de origem";
    }
    if (!formData.paisDestino) {
      newErrors.paisDestino = "Por favor, selecione o país de destino";
    }
    if (formData.paisDestino === "Outro" && !formData.paisDestinoOutro.trim()) {
      newErrors.paisDestinoOutro = "Por favor, informe qual país de destino";
    }
    if (!formData.dataViagem) {
      newErrors.dataViagem = "Por favor, selecione quando pretende viajar";
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      trackEvent("cvi_step_2_completed", getFormAnalyticsContext(2));
    } else {
      trackEvent("cvi_form_error", {
        ...getFormAnalyticsContext(2),
        error_step: 2,
        error_fields: Object.keys(newErrors),
      });
    }
    return isValid;
  };

  const validateStep3 = () => {
    const newErrors: FormErrors = {};
    if (!formData.nomeTutor.trim()) {
      newErrors.nomeTutor = "Por favor, digite seu nome completo";
    }
    const contact = formData.emailOuTelefone.trim();
    if (!contact) {
      newErrors.emailOuTelefone = "Por favor, informe seu WhatsApp";
    } else if (contact.includes("@")) {
      newErrors.emailOuTelefone = "Por favor, informe apenas seu WhatsApp (e-mail não aceito)";
    } else if (!normalizePhone(contact, formData.phoneCountry)) {
      newErrors.emailOuTelefone = "Informe um WhatsApp válido. Se for outro país, selecione o DDI correto.";
    }
    if (formData.emailOpcional.trim()) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.emailOpcional.trim())) {
        newErrors.emailOpcional = "Informe um e-mail válido ou deixe em branco";
      }
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      trackEvent("cvi_step_3_completed", getFormAnalyticsContext(3));
    } else {
      trackEvent("cvi_form_error", {
        ...getFormAnalyticsContext(3),
        error_step: 3,
        error_fields: Object.keys(newErrors),
      });
    }
    return isValid;
  };
  
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Tab switcher state for comparison table on mobile
  const [compActiveTab, setCompActiveTab] = useState<"cvi" | "diy">("cvi");

  // TabNudge visibility titles
  useEffect(() => {
    const handleVisibilityChange = () => {
      document.title = document.hidden 
        ? "Seu pet está te esperando" 
        : "CVI Fácil | Viagem Internacional de Cães e Gatos";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Notification popup states
  const [notification, setNotification] = useState<{
    visible: boolean;
    name: string;
    dest: string;
  }>({ visible: false, name: "", dest: "" });

  useEffect(() => {
    const names = ["Mel", "Luna", "Theo", "Max", "Bento", "Amora", "Cacau", "Thor", "Frida", "Zeus"];
    const dests = ["Portugal", "Estados Unidos", "Alemanha", "Canadá", "Itália", "França", "Irlanda"];
    let hideTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;
    
    const showNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomDest = dests[Math.floor(Math.random() * dests.length)];
      setNotification({ visible: true, name: randomName, dest: randomDest });

      hideTimer = setTimeout(() => {
        setNotification((prev) => ({ ...prev, visible: false }));
        const nextDelay = 28000 + Math.floor(Math.random() * 18000);
        nextTimer = setTimeout(showNotification, nextDelay);
      }, 6500);
    };

    nextTimer = setTimeout(showNotification, 12000);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, []);

  const confirmationPetParts = [];
  if (formData.qtdCachorros > 0) {
    confirmationPetParts.push(`${formData.qtdCachorros} ${formData.qtdCachorros === 1 ? "cachorro" : "cachorros"}`);
  }
  if (formData.qtdGatos > 0) {
    confirmationPetParts.push(`${formData.qtdGatos} ${formData.qtdGatos === 1 ? "gato" : "gatos"}`);
  }
  const confirmationPetSummary = confirmationPetParts.join(" e ") || "Não informado";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://cvifacil.com.br/#organization",
        name: "CVI Fácil",
        url: "https://cvifacil.com.br",
        logo: "https://cvifacil.com.br/assets/logo-cvi-facil.png",
        email: "contato@cvifacil.com.br",
        taxID: "29.922.919/0001-14",
        areaServed: {
          "@type": "Country",
          name: "Brasil",
        },
        knowsAbout: [
          "CVI para cães",
          "CVI para gatos",
          "Certificado Veterinário Internacional",
          "documentação para viagem internacional com pets",
          "sorologia de raiva",
          "exigências sanitárias para cães e gatos",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://cvifacil.com.br/#website",
        url: "https://cvifacil.com.br",
        name: "CVI Fácil",
        inLanguage: "pt-BR",
        publisher: {
          "@id": "https://cvifacil.com.br/#organization",
        },
      },
      {
        "@type": "Service",
        "@id": "https://cvifacil.com.br/#service",
        name: "Assessoria online para CVI de cães e gatos",
        serviceType: "Assessoria documental para Certificado Veterinário Internacional",
        provider: {
          "@id": "https://cvifacil.com.br/#organization",
        },
        areaServed: {
          "@type": "Country",
          name: "Brasil",
        },
        audience: {
          "@type": "Audience",
          audienceType: "Tutores de cães e gatos que vão viajar para o exterior",
        },
        description:
          "Orientação e acompanhamento para organizar o CVI de cães e gatos em viagens internacionais, com análise de destino, prazos, documentos e suporte pelo WhatsApp.",
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: "https://cvifacil.com.br/#avaliacao",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://cvifacil.com.br/#faq",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  const selectedPhoneCountry = getPhoneOptionByIso(formData.phoneCountry);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ==========================================
          HEADER
          ========================================== */}
      <header
        className="fixed top-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100/80 shadow-[0_2px_10px_rgba(6,42,87,0.015)] transition-all duration-200"
      >
        <div className="container-custom mx-auto h-[64px] md:h-[76px] flex items-center justify-between">
          {/* Logo */}
          <div className="w-[112px] md:w-[145px] h-[34px] md:h-[36px] flex items-center">
            <img
              src="/assets/logo-cvi-facil.png"
              alt="CVI Fácil"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {/* Navigation Links (Pill Style) */}
          {/* Navigation Links (Pill Style - Sliding Magnetic Background) */}
          <nav className="relative hidden lg:flex items-center gap-1 bg-transparent p-1.5 rounded-full select-none">
            {/* The sliding dark-navy background pill */}
            <div 
              className="absolute top-1 bottom-1 bg-navy rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-0"
              style={indicatorStyle}
            />

            {[
              { id: "home", label: "Início" },
              { id: "problemas", label: "Problemas" },
              { id: "comparativo", label: "Por que nós?" },
              { id: "etapas", label: "Etapas" },
              { id: "faq", label: "FAQ" }
            ].map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  ref={(el) => { navRefs.current[link.id] = el; }}
                  href={`#${link.id}`}
                  onClick={(e) => handleSmoothScroll(e, link.id)}
                  className={`relative z-10 text-[13.5px] font-bold px-4 py-1.5 rounded-full transition-colors duration-250 ${
                    isActive ? "text-white" : "text-gray-500 hover:text-navy"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Area */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Desktop Text (With Stacked Pet Avatars) */}
            <div className="hidden lg:flex items-center gap-3 text-[12px] font-[800] text-navy leading-tight text-left">
              <div className="flex -space-x-2 shrink-0">
                <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                  <img src="/assets/social-proof-01.png" alt="Tutor com pet viajando em segurança" className="object-cover w-full h-full" />
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                  <img src="/assets/social-proof-02.png" alt="Tutor com pet em viagem internacional" className="object-cover w-full h-full" />
                </div>
                <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                  <img src="/assets/social-proof-03.png" alt="Pet pronto para viajar com segurança" className="object-cover w-full h-full" />
                </div>
              </div>
              <span>
                Mais de 1.000 pets<br />viajando com segurança
              </span>
            </div>

            {/* CTA Button */}
            <a
              href="#avaliacao"
              onClick={(e) => handleSmoothScroll(e, "avaliacao")}
              className="group hidden md:inline-flex items-center justify-center font-[800] rounded-lg transition-all duration-300 bg-whatsapp hover:bg-whatsapp-hover text-white px-5 h-10 text-[13px] gap-1.5 animate-btn-pulse hover:scale-105 active:scale-[0.98]"
            >
              Iniciar meu CVI
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>

            {/* Mobile Menu Button & CTA Wrapper */}
            <div className="flex items-center gap-2 lg:hidden">
              <a
                href="#avaliacao"
                onClick={(e) => handleSmoothScroll(e, "avaliacao")}
                className="group inline-flex h-10 min-w-[96px] items-center justify-center rounded-xl bg-whatsapp px-3 text-[12.5px] font-extrabold text-white shadow-sm transition-all active:scale-[0.98]"
              >
                <span>Iniciar</span>
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 text-navy cursor-pointer transition-colors hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Fullscreen Menu Drawer overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-x-0 top-[64px] z-40 h-[calc(100dvh-64px)] bg-navy/20 backdrop-blur-sm lg:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
            <div 
              className="absolute top-0 left-0 right-0 max-h-full overflow-y-auto bg-white border-b border-gray-100 p-5 flex flex-col gap-3 shadow-xl select-none animate-slide-down"
              onClick={(e) => e.stopPropagation()}
            >
              {[
                { id: "home", label: "Início" },
                { id: "problemas", label: "Problemas" },
                { id: "comparativo", label: "Por que nós?" },
                { id: "etapas", label: "Etapas" },
                { id: "faq", label: "FAQ" }
              ].map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleSmoothScroll(e, link.id);
                  }}
                  className="py-3 text-[16px] font-extrabold text-navy hover:text-primary transition-colors flex items-center justify-between border-b border-gray-50 last:border-0"
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              ))}
              
              <a
                href="#avaliacao"
                onClick={(e) => {
                  setIsMobileMenuOpen(false);
                  handleSmoothScroll(e, "avaliacao");
                }}
                className="group mt-2 w-full h-12 flex items-center justify-center bg-whatsapp text-white font-extrabold rounded-xl transition-all hover:bg-whatsapp-hover text-[15px] gap-2 shadow-sm active:scale-[0.98]"
              >
                <span>Iniciar meu CVI</span>
                <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col pt-[64px] md:pt-[76px] pb-28 md:pb-0">
        
        {/* ==========================================
            HERO SECTION
            ========================================== */}
        <section id="home" className="relative bg-white pt-16 pb-16 md:pt-24 md:pb-24 overflow-hidden">
          <div className="container-custom relative z-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left Column (Content) */}
            <div className="w-full lg:w-[54%] flex flex-col items-center lg:items-start text-center lg:text-left">
              
              <div className="hidden sm:inline-flex items-center justify-center border border-primary/20 text-primary text-[11.5px] md:text-[12.5px] font-extrabold uppercase rounded-full px-4.5 py-1.5 mb-6 bg-blue-soft tracking-wider">
                CVI para cães e gatos em viagens internacionais
              </div>

              <h1 className="text-[30px] sm:text-[40px] md:text-[46px] lg:text-[54px] xl:text-[58px] font-[850] leading-[1.15] sm:leading-[1.1] text-navy mb-6 tracking-tight max-w-[620px]">
                Seu pet vai viajar para o exterior?
                <span className="block mt-1.5">
                  <span className="text-whatsapp animate-highlight">Comece o CVI sem complicação.</span>
                </span>
              </h1>

              <p className="text-[15px] sm:text-[16.5px] md:text-[18px] text-text-main leading-[1.6] mb-8 max-w-[540px]">
                Nós cuidamos de todo o processo de documentação com segurança, clareza e suporte humano via WhatsApp.
              </p>

              {/* Benefits checklist badges (Single line layout with custom icons) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center justify-start gap-2.5 mb-8 w-full">
                {[
                  { text: "Processo simples e guiado", icon: <Compass className="w-4 h-4 text-primary shrink-0" /> },
                  { text: "Especialistas em CVI", icon: <Award className="w-4 h-4 text-primary shrink-0" /> },
                  { text: "Suporte via WhatsApp", icon: <WhatsAppIcon className="w-4 h-4 text-whatsapp shrink-0" /> }
                ].map((item, idx) => (
                  <div key={idx} className={`inline-flex items-center justify-center lg:justify-start gap-1.5 px-3.5 py-2 bg-blue-soft/40 text-navy font-extrabold text-[12px] sm:text-[12.5px] rounded-lg border border-border/30 min-w-0 ${idx === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                    {item.icon}
                    <span className="text-center lg:text-left lg:whitespace-nowrap">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button, Lock & Trust Widget Row */}
              <div className="w-full lg:w-auto flex flex-col md:flex-row items-center lg:items-start gap-6 lg:gap-8 mt-2">
                {/* Button & Lock Column */}
                <div className="flex flex-col items-center lg:items-start gap-2 w-full sm:w-auto">
                  <a
                    href="#avaliacao"
                    onClick={(e) => handleSmoothScroll(e, "avaliacao")}
                    className="group w-full sm:w-[340px] inline-flex items-center justify-center font-[800] rounded-xl transition-all duration-200 bg-whatsapp hover:bg-whatsapp-hover text-white h-14 px-8 text-[17px] gap-2 animate-btn-pulse hover:scale-102 active:scale-[0.98]"
                  >
                    <span>Iniciar meu CVI</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                  <div className="flex items-start justify-center lg:justify-start gap-2 text-[12px] text-text-muted max-w-[340px] text-center lg:text-left px-2 sm:px-0 mt-1">
                    <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <p>Leva menos de 2 minutos. Tenha em mãos o destino e a data aproximada da viagem.</p>
                  </div>
                </div>
                
                {/* Social Proof (Side-by-Side on Desktop) */}
                <div className="flex flex-row items-center gap-3 self-center lg:self-start lg:mt-3 shrink-0">
                  <div className="flex -space-x-2.5 shrink-0">
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100 shrink-0">
                      <img src="/assets/social-proof-04.png" alt="Tutora que viajou tranquila com pet" className="object-cover w-full h-full" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100 shrink-0">
                      <img src="/assets/social-proof-05.png" alt="Tutor que viajou tranquilo com pet" className="object-cover w-full h-full" />
                    </div>
                    <div className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100 shrink-0">
                      <img src="/assets/social-proof-06.png" alt="Família viajando tranquila com pet" className="object-cover w-full h-full" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start leading-none z-20">
                    <span className="text-[13px] font-extrabold text-navy max-w-[230px] leading-tight">
                      +1.000 tutores já viajaram tranquilo com a gente
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Visual) */}
            <div className="w-full lg:w-[46%] relative flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative w-full max-w-[460px] aspect-[1/1] flex items-center justify-center">
                <img 
                  src="/assets/hero-pets-viagem.png" 
                  alt="Cão Beagle e Gato Listrado prontos para viajar" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* ==========================================
            TRUST STRIP (Rounded Container Style)
            ========================================== */}
        <section className="bg-white py-4 md:py-6">
          <div className="container-custom mx-auto">
            <div className="bg-navy rounded-[20px] md:rounded-[24px] py-5 md:py-6 px-4 sm:px-8 md:px-12 shadow-[0_8px_30px_rgba(6,42,87,0.06)]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-4">
                {[
                  { icon: <MessageSquare className="w-5 h-5 text-white" />, title: "Atendimento", subtitle: "humanizado" },
                  { icon: <ClipboardList className="w-5 h-5 text-white" />, title: "Processo guiado", subtitle: "do início ao fim" },
                  { icon: <Headset className="w-5 h-5 text-white" />, title: "Suporte rápido", subtitle: "pelo WhatsApp" },
                  { icon: <Award className="w-5 h-5 text-white" />, title: "Especialistas em", subtitle: "documentação" }
                ].map((item, idx) => (
                  <div key={idx} className="micro-card flex h-full min-h-[92px] flex-col items-center justify-start gap-2 rounded-xl px-2.5 py-3 text-center sm:min-h-[88px] sm:flex-row sm:justify-start sm:text-left lg:min-h-0 lg:px-2 lg:py-2">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white text-[12px] sm:text-[13px] md:text-[14px] font-[800] leading-tight uppercase tracking-wide">
                        {item.title}
                      </h3>
                      <p className="text-blue-200/85 text-[12px] md:text-[13px] mt-0.5 leading-snug">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        
        
        {/* ==========================================
            AIRLINES CAROUSEL SECTION
            ========================================== */}
        <section className="bg-white py-6 border-b border-gray-100/50 overflow-hidden select-none">
          <div className="container-custom mx-auto text-center mb-4">
            <p className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.25em]">
              PREPARAMOS SEU PET PARA TODAS AS COMPANHIAS AÉREAS
            </p>
          </div>
          
          <div className="marquee-pause-area relative w-full overflow-hidden flex flex-row">
            {/* Gradients on the edges for a fade-out shadow effect */}
            <div className="absolute top-0 left-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            
            {/* Set 1 */}
            <div className="flex gap-8 py-2 animate-marquee whitespace-nowrap shrink-0">
              {[
                { name: "TAP Air Portugal", logo: "/assets/logo-tap.webp" },
                { name: "LATAM Airlines", logo: "/assets/logo-latam.png" },
                { name: "GOL", logo: "/assets/logo-gol.webp" },
                { name: "Azul Linhas Aéreas", logo: "/assets/logo-azul.webp" },
                { name: "Iberia", logo: "/assets/logo-iberia.webp" },
                { name: "Lufthansa", logo: "/assets/logo-lufthansa.webp" },
                { name: "American Airlines", logo: "/assets/logo-american.webp" }
              ].map((airline, idx) => (
                <div key={idx} className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-xl transition-colors shrink-0 h-[52px] min-w-[130px]">
                  <img src={airline.logo} alt={airline.name} className="h-6.5 max-w-[100px] object-contain select-none pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Set 2 (Identical Clone for infinite seamless loop) */}
            <div className="flex gap-8 py-2 animate-marquee whitespace-nowrap shrink-0" aria-hidden="true">
              {[
                { name: "TAP Air Portugal", logo: "/assets/logo-tap.webp" },
                { name: "LATAM Airlines", logo: "/assets/logo-latam.png" },
                { name: "GOL", logo: "/assets/logo-gol.webp" },
                { name: "Azul Linhas Aéreas", logo: "/assets/logo-azul.webp" },
                { name: "Iberia", logo: "/assets/logo-iberia.webp" },
                { name: "Lufthansa", logo: "/assets/logo-lufthansa.webp" },
                { name: "American Airlines", logo: "/assets/logo-american.webp" }
              ].map((airline, idx) => (
                <div key={`dup-${idx}`} className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-xl transition-colors shrink-0 h-[52px] min-w-[130px]">
                  <img src={airline.logo} alt={airline.name} className="h-6.5 max-w-[100px] object-contain select-none pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </section>
  
  

        {/* ==========================================
            PROBLEM SECTION
            ========================================== */}
        <section id="problemas" className="bg-white py-12 md:py-20 border-b border-border/50">
          <div className="container-custom mx-auto flex flex-col gap-10">
            <div className="w-full text-center lg:text-left max-w-2xl">
              <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-[850] text-navy leading-[1.15] mb-4 tracking-tight">
                O CVI não começa só no formulário.
              </h2>
              <p className="text-[15px] sm:text-[16px] text-text-main leading-[1.6]">
                Existem etapas essenciais antes de preencher qualquer documento. A gente cuida de tudo para você.
              </p>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <CalendarRange className="w-6.5 h-6.5 text-primary" />, title: "Planejamento personalizado", text: "Analisamos seu destino, prazos e exigências específicas." },
                { icon: <ClipboardList className="w-6.5 h-6.5 text-primary" />, title: "Coleta e revisão de documentos", text: "Conferimos cada detalhe para evitar erros e atrasos." },
                { icon: <Edit className="w-6.5 h-6.5 text-primary" />, title: "Preenchimento correto", text: "Tudo preenchido de forma certa, com linguagem técnica adequada." },
                { icon: <ShieldCheck className="w-6.5 h-6.5 text-primary" />, title: "Acompanhamento até a emissão", text: "Acompanhamos cada etapa até o CVI ser emitido." }
              ].map((card, idx) => (
                <div 
                  key={idx} 
                  className="micro-card bg-white border border-gray-100 rounded-2xl p-6 flex flex-col h-full hover:border-primary/20 group cursor-default relative z-10"
                >
                  <div className="mb-5 bg-blue-soft/50 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    {card.icon}
                  </div>
                  <h3 className="text-[16px] font-extrabold text-navy mb-2 transition-colors duration-300 group-hover:text-primary leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-text-muted leading-[1.5]">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            CONSEQUENCES SECTION (LOSS AVERSION)
            ========================================== */}
        <section className="bg-red-50/40 py-12 md:py-20 border-y border-red-100/60 relative overflow-hidden">
          <div className="container-custom mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 px-2 flex flex-col items-center">
              <span className="grid max-w-[260px] grid-cols-[16px_minmax(0,1fr)] items-center justify-center gap-2 rounded-full border border-red-200/50 bg-red-100/80 px-4 py-2 text-center text-[10px] font-bold uppercase leading-[1.25] tracking-[0.04em] text-red-700 sm:inline-flex sm:max-w-none sm:gap-1.5 sm:px-4.5 sm:py-1.5 sm:text-[11px] sm:tracking-wider mb-4">
                <AlertTriangle className="h-3.5 w-3.5 self-center" />
                <span>O que acontece se a documentação do pet falhar?</span>
              </span>
              <h2 className="text-[26px] sm:text-[34px] md:text-[38px] font-[850] text-navy leading-[1.15] tracking-tight">
                Evite dores de cabeça e atrasos desnecessários
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10 mt-12">
              {[
                { title: "Entrada negada", text: "Seu pet pode ser impedido de entrar no país e precisar retornar.", icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" /> },
                { title: "Quarentena forçada", text: "Gastos altos e estresse para o pet com procedimentos de quarentena.", icon: <Lock className="w-5 h-5 text-red-500 shrink-0" /> },
                { title: "Perda da data da viagem", text: "Passagens, hospedagens e conexões podem ser canceladas ou remarcadas.", icon: <CalendarX className="w-5 h-5 text-red-500 shrink-0" /> }
              ].map((risk, idx) => (
                <div 
                  key={idx} 
                  className="micro-card bg-white border border-red-100/70 rounded-2xl px-6 pb-6 pt-0 lg:px-7 lg:pb-7 flex flex-col h-full hover:border-red-200 group relative z-10 overflow-hidden"
                >
                  {/* Full-bleed Cover Image for consequence card */}
                  <div className="-mx-6 lg:-mx-7 w-[calc(100%+3rem)] lg:w-[calc(100%+3.5rem)] h-[170px] mb-5 overflow-hidden shadow-sm relative">
                    <img 
                      src={riskImages[idx]} 
                      alt={risk.title} 
                      className="w-full h-full object-cover select-none pointer-events-none transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-red-50 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                      {risk.icon}
                    </div>
                    <h3 className="text-[17px] font-extrabold text-navy transition-colors duration-300 group-hover:text-red-600 leading-snug">
                      {risk.title}
                    </h3>
                  </div>
                  <p className="text-[13.5px] sm:text-[14px] text-text-muted leading-[1.5] mt-auto">
                    {risk.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center px-4">
              <a 
                href="#avaliacao" 
                onClick={(e) => handleSmoothScroll(e, "avaliacao")}
                className="w-full sm:w-auto inline-flex items-center justify-center font-[800] rounded-xl transition-all duration-300 hover:-translate-y-0.5 bg-whatsapp hover:bg-whatsapp-hover text-white h-12 px-8 text-[15px] border-none"
              >
                Evitar riscos e faça seu CVI do jeito certo
              </a>
            </div>
          </div>
        </section>

        {/* ==========================================
            WHATSAPP SUPPORT SECTION (UX/UI Rebuilt & Aligned)
            ========================================== */}
        <section className="bg-[#eef8fc] pt-12 pb-0 md:pt-36 md:pb-0 border-b border-gray-100 overflow-hidden relative select-none">
          <div className="container-custom mx-auto flex flex-col lg:flex-row items-stretch gap-8 lg:gap-16 relative">
            
            {/* Left Column (Huge Phone Image bleeding to bottom) */}
            <div className="w-full lg:w-[50%] flex justify-center items-end self-end lg:self-stretch z-10 mt-0 lg:mt-0 relative overflow-visible order-2 lg:order-1">
              <div className="relative lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 h-[320px] sm:h-[380px] lg:h-[780px] flex items-end justify-center w-full lg:w-[155%] max-w-[520px] lg:max-w-[880px] translate-y-0 lg:translate-y-[65px] mx-auto">
                <img 
                  src="/assets/whatsapp-na-mao.png" 
                  alt="Celular com WhatsApp do CVI Fácil" 
                  className="w-auto h-full object-contain object-bottom align-bottom"
                />
              </div>
            </div>

            {/* Right Column (Vertically Centered Copy with Decoupled Padding) */}
            <div className="w-full lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left justify-center pb-0 lg:pb-36 pt-0 lg:pt-0 z-20 order-1 lg:order-2">
              <div className="inline-flex items-center justify-center border border-[#1182ba]/30 text-[#1182ba] text-[11px] md:text-[12px] font-bold uppercase rounded-full px-4 py-1.5 mb-6 bg-white tracking-wider">
                SUPORTE VIA WHATSAPP
              </div>

              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-[850] leading-[1.12] text-navy mb-4 tracking-tight font-sans">
                Processo 100% digital<span className="block text-whatsapp lg:inline"> e sem sair de casa.</span>
              </h2>
              
              <p className="text-[15.5px] sm:text-[16.5px] text-text-main leading-[1.65] mb-6 md:mb-8 max-w-[500px]">
                Resolvemos todo o seu CVI diretamente pelo WhatsApp, na palma da sua mão. Você não precisa ir ao MAPA ou enfrentar filas. Cuidamos de toda a burocracia do início ao fim.
              </p>

              <ul className="flex flex-col gap-3.5 text-left w-full max-w-[480px]">
                {[
                  "Atendimento 100% pelo seu WhatsApp",
                  "Faça tudo sem sair de casa ou ir ao MAPA",
                  "Orientações claras e acompanhamento completo",
                  "Alertas e lembretes de prazos e vacinas",
                  "Segurança e tranquilidade até o pet embarcar"
                ].map((item, idx) => (
                  <li 
                    key={idx} 
                    className="micro-card flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100/60"
                  >
                    <CheckCircle2 className="w-5 h-5 text-whatsapp flex-shrink-0 mt-0.5" />
                    <span className="text-[15px] sm:text-[14.5px] font-bold text-navy leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ==========================================
            COMPARISON SECTION
            ========================================== */}
        <section id="comparativo" className="bg-white py-16 md:py-24 border-b border-gray-100">
          <div className="container-custom mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
              <h2 className="text-[28px] sm:text-[34px] md:text-[38px] font-[850] text-navy leading-[1.15] mb-5 tracking-tight">
                Por que escolher a CVI Fácil?
              </h2>
            </div>

            {/* Mobile Tabbed Layout */}
            <div className="block md:hidden px-2">
              <div className="flex bg-blue-soft/60 p-1 rounded-xl mb-6">
                <button
                  onClick={() => setCompActiveTab("cvi")}
                  className={`flex-1 py-3 text-[14px] font-extrabold rounded-lg transition-all duration-300 active:scale-[0.98] ${
                    compActiveTab === "cvi" ? "bg-primary text-white" : "text-navy"
                  }`}
                >
                  Com a CVI Fácil
                </button>
                <button
                  onClick={() => setCompActiveTab("diy")}
                  className={`flex-1 py-3 text-[14px] font-extrabold rounded-lg transition-all duration-300 active:scale-[0.98] ${
                    compActiveTab === "diy" ? "bg-red-100 text-red-700 shadow-sm ring-1 ring-red-200" : "text-navy"
                  }`}
                >
                  Fazer sozinho
                </button>
              </div>

              <div className={`p-6 rounded-2xl border transition-all ${
                compActiveTab === "cvi" 
                  ? "bg-blue-soft/20 border-primary/20 "
                  : "bg-red-50 border-red-100 "
              }`}>
                <h3 className={`text-[17px] font-extrabold mb-4 flex items-center gap-2 ${
                  compActiveTab === "cvi" ? "text-primary-dark" : "text-red-700"
                }`}>
                  {compActiveTab === "cvi" ? (
                    <><CheckCircle2 className="w-5 h-5 text-whatsapp" /> Com a CVI Fácil</>
                  ) : (
                    <><XCircle className="w-5 h-5 text-red-500" /> Fazer sozinho</>
                  )}
                </h3>

                <div className="space-y-4">
                  {comparisonData.map((item, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <span className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1 font-sans">
                        {item.feature}
                      </span>
                      <span className={`text-[14.5px] ${
                        compActiveTab === "cvi" ? "text-emerald-700 font-black" : "text-red-700 font-bold"
                      }`}>
                        {compActiveTab === "cvi" ? item.cvi : item.diy}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Grid Table */}
            <div className="hidden md:block max-w-4xl mx-auto bg-white border border-border rounded-[24px]  overflow-hidden">
              <div className="flex bg-navy text-white">
                <div className="flex-[1.2] p-6 flex items-center text-[15px] md:text-[16px] font-extrabold tracking-wider uppercase opacity-90">
                  O QUE VOCÊ PRECISA
                </div>
                <div className="flex-1 p-6 border-l border-white/10 bg-red-500 flex items-center justify-center text-center">
                  <span className="text-[17px] font-bold flex items-center gap-1.5 justify-center text-white">
                    <XCircle className="w-5 h-5 text-red-100" /> Fazer sozinho
                  </span>
                </div>
                <div className="flex-1 p-5 border-l border-white/10 bg-primary flex items-center justify-center text-center">
                  <div className="h-[30px] w-[125px] relative brightness-0 invert flex items-center justify-center">
                    <img src="/assets/logo-cvi-facil.png" alt="CVI Fácil" className="max-w-full max-h-full object-contain" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-border">
                {comparisonData.map((row, idx) => (
                  <div key={idx} className="flex hover:bg-gray-50 transition-colors">
                    <div className="flex-[1.2] p-5 flex items-center text-[14.5px] font-bold text-navy">
                      {row.feature}
                    </div>
                    <div className="flex-1 p-5 border-l border-border bg-red-50/70 flex items-center justify-center transition-colors duration-300 hover:bg-red-50">
                      <div className="flex items-start gap-2 text-left w-full max-w-[200px]">
                        <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                        <span className="text-[14px] text-red-700 font-bold leading-tight">{row.diy}</span>
                      </div>
                    </div>
                    <div className="flex-1 p-5 border-l border-border bg-emerald-50/5 flex items-center justify-center">
                      <div className="flex items-start gap-2 text-left w-full max-w-[220px]">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-[14.5px] font-extrabold text-emerald-700 leading-tight">{row.cvi}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 md:mt-12 text-center px-4">
              <a
                href="#avaliacao"
                onClick={(e) => handleSmoothScroll(e, "avaliacao")}
                className="group w-full sm:w-[320px] inline-flex items-center justify-center font-[800] rounded-xl transition-all duration-200 bg-whatsapp hover:bg-whatsapp-hover text-white h-14 text-[16px] gap-2 animate-btn-pulse hover:scale-102 active:scale-[0.98]"
              >
                <span>Iniciar meu CVI</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>

        {/* ==========================================
            STEPS SECTION (TIMELINE)
            ========================================== */}
        <section id="etapas" className="bg-white py-12 md:py-24 border-b border-gray-100">
          <div className="container-custom mx-auto">
            <h2 className="text-[28px] sm:text-[34px] md:text-[38px] lg:text-[42px] font-[850] text-center text-navy mb-10 md:mb-16 tracking-tight leading-tight">
              Seu CVI organizado em <span className="text-whatsapp">4 etapas</span>
            </h2>

            <div className="relative flex flex-col lg:flex-row gap-6 lg:gap-6 justify-between max-w-5xl mx-auto px-0 lg:px-0">
              {/* Background Dashed Lines */}
              <div className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-[2px] border-t-2 border-dashed border-primary/20 z-0" />
              <div className="block lg:hidden absolute top-5 bottom-5 left-1/2 -translate-x-1/2 w-[2px] border-l-2 border-dashed border-primary/25 z-0" />

              {[
                { icon: (isLast: boolean) => <Plane className={`w-6 h-6 text-primary/70 transition-colors duration-300 group-hover:text-white`} />, title: "1. Atendimento", text: "Entendemos o destino e as exigências do pet.", isLast: false },
                { icon: (isLast: boolean) => <ClipboardCheck className={`w-6 h-6 text-primary/70 transition-colors duration-300 group-hover:text-white`} />, title: "2. Documentação", text: "Reunimos, revisamos e preparamos tudo.", isLast: false },
                { icon: (isLast: boolean) => <Files className={`w-6 h-6 text-primary/70 transition-colors duration-300 group-hover:text-white`} />, title: "3. Aprovação", text: "Acompanhamos o processo com o MAPA até a emissão.", isLast: false },
                { icon: (isLast: boolean) => <CheckCircle className={`w-6 h-6 ${isLast ? "text-whatsapp" : "text-primary/70"} transition-colors duration-300 group-hover:text-white`} />, title: "4. Viagem segura", text: "Você recebe o CVI e viaja com total tranquilidade.", isLast: true }
              ].map((step, idx) => {
                const isLast = step.isLast;
                return (
                  <div 
                    key={idx} 
                    className="group relative flex flex-col items-center gap-3 lg:gap-5 flex-grow flex-1 z-10 text-center font-sans transition-all duration-300 lg:hover:-translate-y-1 lg:hover:scale-[1.02]"
                  >
                    {/* Circle Indicator */}
                    <div className={`relative shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center z-15 transition-all duration-300 ${
                      isLast 
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700 animate-soft-green-pulse group-hover:border-emerald-700 group-hover:bg-emerald-700 group-hover:text-white group-hover:shadow-[0_0_18px_rgba(5,150,105,0.32)]" 
                        : "border-gray-200 bg-white text-gray-400 group-hover:border-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-[0_0_15px_rgba(17,130,186,0.22)]"
                    }`}>
                      {step.icon(isLast)}
                      <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white font-extrabold text-[10px] flex items-center justify-center transition-all duration-300 bg-gray-300 ${
                        isLast ? "bg-emerald-700 group-hover:bg-white group-hover:text-emerald-700" : "group-hover:bg-white group-hover:text-primary"
                      }`}>
                        {idx + 1}
                      </div>
                    </div>

                    {/* Step description */}
                    <div className="flex-1 text-center transition-all duration-300 opacity-100">
                      <h3 className="text-[17px] sm:text-[18px] font-extrabold mb-1.5 leading-tight transition-colors duration-300 text-navy">
                        {step.title}
                      </h3>
                      <p className="mx-auto text-[14.5px] sm:text-[15px] leading-[1.55] max-w-[280px] font-sans transition-colors duration-300 text-text-muted">
                        {step.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================
            FORM SECTION
            ========================================== */}
        <section id="avaliacao" className="relative bg-blue-section overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            {/* Clean solid background, no textures or gradients */}
          </div>

          <div className="container-custom mx-auto py-12 md:py-24 relative z-10 grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(520px,1.15fr)] gap-8 lg:gap-x-[72px] lg:gap-y-6 items-center">
            
            {/* LEFT COLUMN (Header, Supporting Text, Benefits, NO IMAGE) */}
            <div className="w-full flex flex-col text-white items-center lg:items-start text-center lg:text-left px-2 order-1 lg:row-start-1 lg:col-start-1">
              {/* Badge: EMISSÃO DE CVI */}
              <div className="inline-flex items-center justify-center border border-white/20 text-white text-[11px] md:text-[11.5px] font-extrabold uppercase rounded-full px-4 py-1.5 mb-6 bg-white/5 tracking-wider select-none">
                <Zap className="w-3.5 h-3.5 mr-1 text-white fill-white" /> Emissão de CVI
              </div>

              <h2 className="text-[29px] sm:text-[38px] lg:text-[54px] font-[850] leading-[1.12] lg:leading-[1.05] tracking-tight lg:tracking-[-0.03em] text-white max-w-[500px] mb-4 font-sans">
                Comece a emissão do seu CVI em <span className="text-sky-300 font-black block sm:inline">3 passos</span>
              </h2>
              <p className="text-[15.5px] sm:text-[16px] text-blue-50 leading-[1.65] mb-6 md:mb-8 max-w-[440px]">
                Preencha as primeiras informações do seu pet e tutor. Nosso time de especialistas continua o processo rapidamente para você.
              </p>
            </div>

            {/* BENEFITS CARD BLOCK (Grid Position Left Row 2) */}
            <div className="w-full flex flex-col gap-3 md:gap-4 order-3 lg:order-none lg:row-start-2 lg:col-start-1 max-w-[440px] mx-auto lg:mx-0">
              {[
                { icon: <Zap className="w-5 h-5 text-white" />, title: "Rápido", desc: "Leva menos de 2 minutos." },
                { icon: <ShieldCheck className="w-5 h-5 text-white" />, title: "Seguro", desc: "Seus dados estão protegidos." },
                { icon: <HeartHandshake className="w-5 h-5 text-white" />, title: "Sem compromisso", desc: "Você recebe uma análise sem custo." }
              ].map((item, idx) => (
                <div key={idx} className="micro-card flex items-start gap-4 bg-white/10 backdrop-blur-[2px] p-4 rounded-2xl border border-white/20">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="text-left">
                    <strong className="block text-[14.5px] font-bold text-white mb-0.5">{item.title}</strong>
                    <span className="text-[13.5px] text-white/85 font-medium leading-relaxed font-sans">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT COLUMN (Form Wizard Card) */}
            <div className="w-full flex justify-center lg:justify-end px-0 sm:px-0 order-2 lg:order-none lg:row-start-1 lg:row-span-3 lg:col-start-2 self-start">
              <div className="w-full max-w-[600px] bg-white rounded-[22px] sm:rounded-[24px] p-5 sm:p-8 shadow-[0_24px_60px_rgba(0,35,75,0.18)] flex flex-col relative">
                


                {formStep < 4 && (
                  <>
                    <div className="flex items-center justify-between pb-5 select-none">
                      {[
                        { step: 1, label: "Pet" },
                        { step: 2, label: "Viagem" },
                        { step: 3, label: "Tutor" },
                      ].map((item, index) => {
                        const isActive = formStep === item.step;
                        const isDone = formStep > item.step;
                        return (
                          <React.Fragment key={item.step}>
                            <div className="flex min-w-0 flex-col items-center gap-1 sm:flex-row sm:gap-2">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-black transition-all ${
                                isActive
                                  ? "bg-primary text-white"
                                  : isDone
                                    ? "bg-whatsapp text-white"
                                    : "bg-gray-100 text-gray-400"
                              }`}>
                                {isDone ? "✓" : item.step}
                              </div>
                              <span className={`text-[12px] font-bold sm:text-[13px] ${
                                isActive ? "text-navy font-black" : "text-gray-400"
                              }`}>
                                {item.label}
                              </span>
                            </div>
                            {index < 2 && (
                              <div className={`mx-2 h-[2px] flex-1 transition-colors sm:mx-4 ${
                                formStep > item.step ? "bg-primary" : "bg-gray-100"
                              }`} />
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <div className="h-px bg-gray-100 mb-6" />
                  </>
                )}

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 sm:gap-5">
                  
                  {/* STEP 1: TRAVEL & PET SPECIES (ECOMMERCE COUNTERS AND TRAVEL DETAILS) */}
                  {formStep === 1 && (
                    <div className="flex flex-col gap-4 animate-fade-in">

                      {/* 1. Tipo de pet & Quantidade (Symmetrical edge-to-edge layout, always side-by-side) */}
                      <div className="flex flex-col gap-2.5">
                        <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Tipo de pet</label>
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                          
                          {/* Gato Card */}
                          <div 
                            className={`flex-grow flex-1 flex items-center min-h-[72px] sm:h-[64px] px-4.5 sm:px-4 rounded-xl border-2 transition-all duration-200 relative ${
                              formData.qtdGatos > 0 
                                ? 'border-primary bg-blue-50/40 text-primary-dark shadow-[0_4px_12px_rgba(17,130,186,0.06)]' 
                                : 'border-gray-200 text-text-muted hover:border-gray-300 bg-white'
                            }`}
                          >
                            {showQuantityCounters ? (
                              <>
                                {/* Symmetrical Left Decrement */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const nextQty = Math.max(0, formData.qtdGatos - 1);
                                    setFormData({ ...formData, qtdGatos: nextQty });
                                    if (nextQty + formData.qtdCachorros > 0) clearFieldErrors("tipoPet");
                                    trackEvent("cvi_quantity_gato_changed", { qty: nextQty });
                                  }}
                                  className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center font-black text-[18px] transition-all cursor-pointer shadow-sm z-10 shrink-0"
                                >
                                  -
                                </button>
                                
                                {/* Center Pet Details & Qty */}
                                <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
                                  <Cat className="w-4.5 h-4.5 text-primary shrink-0" />
                                  <span className="font-bold text-[13.5px] sm:text-[14.5px]">Gato</span>
                                  <span className="font-black text-[12px] bg-primary text-white w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ml-0.5">
                                    {formData.qtdGatos}
                                  </span>
                                </div>
                                
                                {/* Symmetrical Right Increment */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const nextQty = formData.qtdGatos + 1;
                                    setFormData({ ...formData, qtdGatos: nextQty });
                                    clearFieldErrors("tipoPet");
                                    trackEvent("cvi_quantity_gato_changed", { qty: nextQty });
                                  }}
                                  className="ml-auto w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center font-black text-[18px] transition-all cursor-pointer shadow-sm z-10 shrink-0"
                                >
                                  +
                                </button>
                              </>
                            ) : (
                              // Single pet click anywhere selector
                              <div 
                                className="relative flex items-center justify-center w-full h-full cursor-pointer select-none"
                                onClick={() => {
                                  setFormData({ ...formData, qtdGatos: 1, qtdCachorros: 0, tipoPet: "Gato" });
                                  clearFieldErrors("tipoPet");
                                  trackEvent("cvi_pet_type_selected", { type: "Gato" });
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Cat className="w-4.5 h-4.5 shrink-0 text-primary" />
                                  <span className="font-bold text-[13.5px] sm:text-[14.5px]">Gato</span>
                                </div>
                                {formData.qtdGatos > 0 && (
                                  <span className="absolute right-2.5 sm:right-4 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-[9px] font-extrabold animate-fade-in select-none">✓</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Cachorro Card */}
                          <div 
                            className={`flex-grow flex-1 flex items-center min-h-[72px] sm:h-[64px] px-4.5 sm:px-4 rounded-xl border-2 transition-all duration-200 relative ${
                              formData.qtdCachorros > 0 
                                ? 'border-primary bg-blue-50/40 text-primary-dark shadow-[0_4px_12px_rgba(17,130,186,0.06)]' 
                                : 'border-gray-200 text-text-muted hover:border-gray-300 bg-white'
                            }`}
                          >
                            {showQuantityCounters ? (
                              <>
                                {/* Symmetrical Left Decrement */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const nextQty = Math.max(0, formData.qtdCachorros - 1);
                                    setFormData({ ...formData, qtdCachorros: nextQty });
                                    if (formData.qtdGatos + nextQty > 0) clearFieldErrors("tipoPet");
                                    trackEvent("cvi_quantity_cao_changed", { qty: nextQty });
                                  }}
                                  className="w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center font-black text-[18px] transition-all cursor-pointer shadow-sm z-10 shrink-0"
                                >
                                  -
                                </button>
                                
                                {/* Center Pet Details & Qty */}
                                <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
                                  <Dog className="w-4.5 h-4.5 text-primary shrink-0" />
                                  <span className="font-bold text-[13.5px] sm:text-[14.5px]">Cachorro</span>
                                  <span className="font-black text-[12px] bg-primary text-white w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 ml-0.5">
                                    {formData.qtdCachorros}
                                  </span>
                                </div>
                                
                                {/* Symmetrical Right Increment */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const nextQty = formData.qtdCachorros + 1;
                                    setFormData({ ...formData, qtdCachorros: nextQty });
                                    clearFieldErrors("tipoPet");
                                    trackEvent("cvi_quantity_cao_changed", { qty: nextQty });
                                  }}
                                  className="ml-auto w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center font-black text-[18px] transition-all cursor-pointer shadow-sm z-10 shrink-0"
                                >
                                  +
                                </button>
                              </>
                            ) : (
                              // Single pet click anywhere selector
                              <div 
                                className="relative flex items-center justify-center w-full h-full cursor-pointer select-none"
                                onClick={() => {
                                  setFormData({ ...formData, qtdCachorros: 1, qtdGatos: 0, tipoPet: "Cão" });
                                  clearFieldErrors("tipoPet");
                                  trackEvent("cvi_pet_type_selected", { type: "Cão" });
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Dog className="w-4.5 h-4.5 shrink-0 text-primary" />
                                  <span className="font-bold text-[13.5px] sm:text-[14.5px]">Cachorro</span>
                                </div>
                                {formData.qtdCachorros > 0 && (
                                  <span className="absolute right-2.5 sm:right-4 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white text-[9px] font-extrabold animate-fade-in select-none">✓</span>
                                )}
                              </div>
                            )}
                          </div>

                        </div>
                        
                        {/* Dynamic Multi-Pet text trigger link (Aligned Right, Italic, No Underline) */}
                        <div className="flex items-center justify-end w-full select-none">
                          {!showQuantityCounters ? (
                            <button 
                              type="button"
                              onClick={() => {
                                setShowQuantityCounters(true);
                                trackEvent("cvi_show_quantity_counters_clicked");
                              }}
                              className="min-h-8 px-1 text-[13px] font-extrabold text-primary hover:text-primary-dark italic cursor-pointer transition-colors"
                            >
                              Vai viajar com mais de um pet?
                            </button>
                          ) : (
                            <button 
                              type="button"
                              onClick={() => {
                                setShowQuantityCounters(false);
                                const hasCat = formData.qtdGatos > 0;
                                const hasDog = formData.qtdCachorros > 0;
                                setFormData({
                                  ...formData,
                                  qtdGatos: hasCat ? 1 : 0,
                                  qtdCachorros: (!hasCat && hasDog) ? 1 : 0
                                });
                                trackEvent("cvi_hide_quantity_counters_clicked");
                              }}
                              className="min-h-8 px-1 text-[13px] font-extrabold text-text-muted hover:text-navy italic cursor-pointer transition-colors"
                            >
                              Voltar para apenas 1 pet
                            </button>
                          )}
                        </div>

                        {showQuantityCounters && (formData.qtdGatos + formData.qtdCachorros) > 1 && (
                          <div className="bg-emerald-50/40 text-emerald-700 text-[11px] font-bold p-2.5 rounded-lg border border-emerald-100/20 select-none animate-fade-in">
                            Desconto de múltiplos pets aplicado automaticamente.
                          </div>
                        )}
                        {errors.tipoPet && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.tipoPet}</span>}
                      </div>

                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                          <label htmlFor="pet_breed" className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Seu pet tem raça?</label>
                          <div className="relative flex items-center">
                            <HeartHandshake className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                              id="pet_breed"
                              name="pet_breed"
                              type="text"
                              placeholder="Ex: Golden, SRD, Persa"
                              autoComplete="off"
                              disabled={formData.racaPet === "Sem raça definida"}
                              className={`pl-12 w-full h-[60px] px-4 rounded-xl border bg-white focus:bg-white font-medium text-[16px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/12 focus:border-primary disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-text-muted ${errors.racaPet ? "border-red-500 focus:ring-red-500/10" : "border-gray-200"}`}
                              value={formData.racaPet}
                              onChange={(e) => {
                                const value = keepOnlyLettersAndSpaces(e.target.value);
                                setFormData({ ...formData, racaPet: value });
                                if (value.trim()) clearFieldErrors("racaPet");
                              }}
                            />
                          </div>
                          <label className="flex min-h-10 w-fit cursor-pointer items-center gap-2 py-1 text-[13px] font-bold text-text-muted">
                            <input
                              type="checkbox"
                              checked={formData.racaPet === "Sem raça definida"}
                              onChange={(event) => {
                                setFormData({
                                  ...formData,
                                  racaPet: event.target.checked ? "Sem raça definida" : "",
                                });
                                if (event.target.checked) clearFieldErrors("racaPet");
                              }}
                              className="sr-only"
                            />
                            <span className={`flex h-5 w-5 items-center justify-center rounded-md border transition-all ${
                              formData.racaPet === "Sem raça definida" ? "border-primary bg-primary text-white" : "border-gray-300 bg-white text-transparent"
                            }`}>
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </span>
                            Não tem raça definida
                          </label>
                          {errors.racaPet && <span className="text-red-500 text-xs font-bold">{errors.racaPet}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <span className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Selecione os procedimentos que seu pet já realizou</span>
                          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                            {veterinaryProcedureOptions.map((procedure) => {
                              const isChecked = formData.procedimentosVeterinarios.includes(procedure);
                              const noProcedureSelected = formData.procedimentosVeterinarios.includes(noVeterinaryProcedureOption);
                              return (
                                <label
                                  key={procedure}
                                  className={`flex min-h-[74px] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border px-1.5 text-center text-[10.5px] font-extrabold transition-all duration-200 sm:min-h-[54px] sm:flex-row sm:gap-2 sm:px-3 sm:text-left sm:text-[12.5px] ${
                                    isChecked
                                      ? "border-primary bg-primary text-white shadow-[0_6px_16px_rgba(17,130,186,0.14)]"
                                      : noProcedureSelected
                                        ? "border-gray-200 bg-gray-50 text-text-muted/55 line-through"
                                        : errors.procedimentosVeterinarios
                                          ? "border-red-300 bg-red-50/40 text-text-muted"
                                          : "border-gray-200 bg-white text-text-muted hover:border-primary/40 hover:bg-blue-soft/40"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    name="veterinary_procedures"
                                    value={procedure}
                                    checked={isChecked}
                                    onChange={() => {
                                      const nextProcedures = isChecked
                                        ? formData.procedimentosVeterinarios.filter((item) => item !== procedure)
                                        : [...formData.procedimentosVeterinarios.filter((item) => item !== noVeterinaryProcedureOption), procedure];
                                      setFormData({ ...formData, procedimentosVeterinarios: nextProcedures });
                                      clearFieldErrors("procedimentosVeterinarios");
                                      trackEvent("cvi_veterinary_procedure_changed", { procedure, selected: !isChecked });
                                    }}
                                    className="sr-only"
                                  />
                                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-all ${
                                    isChecked ? "border-white bg-white text-primary" : "border-gray-300 bg-white text-transparent"
                                  }`}>
                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                  </span>
                                  <span className="leading-tight">{procedure}</span>
                                </label>
                              );
                            })}
                          </div>
                          <label className="flex min-h-10 w-fit cursor-pointer items-center gap-2 py-1 text-[13px] font-bold text-text-muted">
                            <input
                              type="checkbox"
                              checked={formData.procedimentosVeterinarios.includes(noVeterinaryProcedureOption)}
                              onChange={(event) => {
                                const nextProcedures = event.target.checked ? [noVeterinaryProcedureOption] : [];
                                setFormData({ ...formData, procedimentosVeterinarios: nextProcedures });
                                if (event.target.checked) clearFieldErrors("procedimentosVeterinarios");
                                trackEvent("cvi_veterinary_procedure_changed", {
                                  procedure: noVeterinaryProcedureOption,
                                  selected: event.target.checked,
                                });
                              }}
                              className="sr-only"
                            />
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-all ${
                              formData.procedimentosVeterinarios.includes(noVeterinaryProcedureOption) ? "border-primary bg-primary text-white" : "border-gray-300 bg-white text-transparent"
                            }`}>
                              <Check className="h-3.5 w-3.5" strokeWidth={3} />
                            </span>
                            Nenhum procedimento realizado
                          </label>
                          {errors.procedimentosVeterinarios && <span className="text-red-500 text-xs font-bold">{errors.procedimentosVeterinarios}</span>}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (validateStep1()) {
                            setFormStep(2);
                            trackEvent("cvi_step_2_started");
                            if (window.innerWidth < 1024) {
                              smoothScrollToTarget("avaliacao");
                            }
                          }
                        }}
                        className="group mt-2 flex min-h-[62px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-bold uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark hover:brightness-[0.95]"
                      >
                        <span>Avançar para viagem</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                      </button>
                    </div>
                  )}

                  {/* STEP 2: TRAVEL DETAILS */}
                  {formStep === 2 && (
                    <div className="flex flex-col gap-4 animate-fade-in">

                      {/* 2. Cidade de Origem */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="origin_city" className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Cidade de origem</label>
                        <div className="relative flex items-center">
                          <Compass className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                          <input 
                            id="origin_city"
                            name="origin_city"
                            type="text"
                            placeholder="De qual cidade você vai partir?"
                            autoComplete="address-level2"
                            className={`pl-12 w-full h-[60px] px-4 rounded-xl border bg-white focus:bg-white font-medium text-[16px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/12 focus:border-primary ${errors.cidadeOrigem ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-200'}`}
                            value={formData.cidadeOrigem}
                            onChange={(e) => {
                              const value = keepOnlyLettersAndSpaces(e.target.value);
                              setFormData({ ...formData, cidadeOrigem: value });
                              if (value.trim()) clearFieldErrors("cidadeOrigem");
                            }}
                          />
                        </div>
                        {errors.cidadeOrigem && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.cidadeOrigem}</span>}
                      </div>

                      {/* 3. País de destino */}
                      <div className="flex flex-col gap-1.5" ref={destinationDropdownRef}>
                        <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">País de destino</label>
                        <div className="relative">
                          <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={isDestinationOpen}
                            onClick={() => setIsDestinationOpen((open) => !open)}
                            className={`group flex min-h-[62px] w-full items-center justify-between gap-3 rounded-xl border bg-white px-4 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/12 ${
                              errors.paisDestino
                                ? "border-red-500 focus:ring-red-500/10"
                                : isDestinationOpen
                                  ? "border-primary shadow-[0_8px_20px_rgba(17,130,186,0.08)]"
                                  : "border-gray-200 hover:border-primary/40 hover:bg-blue-soft/30"
                            }`}
                          >
                            {formData.paisDestino ? (
                              (() => {
                                const selectedDestination = destinationOptions.find((option) => option.value === formData.paisDestino);
                                return (
                                  <span className="flex min-w-0 items-center gap-3">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-soft">
                                      <DestinationFlag code={selectedDestination?.flagCode ?? "other"} />
                                    </span>
                                    <span className="flex min-w-0 flex-col">
                                      <span className="truncate text-[16px] font-extrabold text-navy">
                                        {selectedDestination?.label}
                                      </span>
                                      <span className="truncate text-[12px] font-semibold text-text-muted">
                                        {selectedDestination?.hint}
                                      </span>
                                    </span>
                                  </span>
                                );
                              })()
                            ) : (
                              <span className="flex min-w-0 items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-soft text-primary">
                                  <Globe2 className="h-4.5 w-4.5" />
                                </span>
                                <span className="flex min-w-0 flex-col">
                                  <span className="text-[16px] font-extrabold text-navy">Selecione o país</span>
                                  <span className="text-[12px] font-semibold text-text-muted">Escolha o destino da viagem</span>
                                </span>
                              </span>
                            )}
                            <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform duration-200 ${isDestinationOpen ? "rotate-180" : ""}`} />
                          </button>

                          {isDestinationOpen && (
                            <div
                              role="listbox"
                              className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[310px] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(6,42,87,0.14)]"
                            >
                              {destinationOptions.map((option) => {
                                const isSelected = formData.paisDestino === option.value;
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                      const restErrors = { ...errors };
                                      delete restErrors.paisDestino;
                                      delete restErrors.paisDestinoOutro;
                                      setFormData({
                                        ...formData,
                                        paisDestino: option.value,
                                        paisDestinoOutro: option.value === "Outro" ? formData.paisDestinoOutro : ""
                                      });
                                      setErrors(restErrors);
                                      setIsDestinationOpen(false);
                                      trackEvent("cvi_destination_selected", { destination: option.value });
                                    }}
                                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left transition-all duration-150 ${
                                      isSelected
                                        ? "bg-primary text-white"
                                        : "text-navy hover:bg-blue-soft"
                                    }`}
                                  >
                                    <span className="flex min-w-0 flex-1 items-center gap-3">
                                      <DestinationFlag code={option.flagCode} />
                                      <span className="truncate text-[15px] font-extrabold">{option.label}</span>
                                    </span>
                                    {isSelected && <Check className="h-4.5 w-4.5 shrink-0 text-white" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {errors.paisDestino && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.paisDestino}</span>}
                      </div>

                      {formData.paisDestino === "Outro" && (
                        <div className="flex flex-col gap-1.5 animate-fade-in">
                          <label htmlFor="destination_country_other" className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Qual país?</label>
                          <div className="relative flex items-center">
                            <Globe2 className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                              id="destination_country_other"
                              name="destination_country_other"
                              type="text"
                              placeholder="Digite o país de destino"
                              className={`pl-12 w-full h-[60px] px-4 rounded-xl border bg-white focus:bg-white font-medium text-[16px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/12 focus:border-primary ${errors.paisDestinoOutro ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-200'}`}
                              value={formData.paisDestinoOutro}
                              onChange={(e) => {
                                const value = keepOnlyLettersAndSpaces(e.target.value);
                                setFormData({ ...formData, paisDestinoOutro: value });
                                if (value.trim()) clearFieldErrors("paisDestinoOutro");
                              }}
                            />
                          </div>
                          {errors.paisDestinoOutro && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.paisDestinoOutro}</span>}
                        </div>
                      )}

                      {/* 4. Previsão da viagem */}
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Previsão da viagem</label>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:flex lg:flex-row lg:flex-nowrap gap-2 w-full select-none">
                          {[
                            "Menos de 1 mês",
                            "De 1 a 3 meses",
                            "De 3 a 6 meses",
                            "De 6 meses a 1 ano",
                            "Ainda não sei"
                          ].map((timeframe, idx) => {
                            const isSelected = formData.dataViagem === timeframe;
                            const isLastOnMobile = idx === 4;
                            return (
                              <button
                                key={timeframe}
                                type="button"
                                onClick={() => {
                                  setFormData({ ...formData, dataViagem: timeframe });
                                  clearFieldErrors("dataViagem");
                                  trackEvent("cvi_timeframe_selected", { timeframe });
                                }}
                                className={`flex items-center justify-center text-center min-h-[48px] sm:min-h-[52px] px-2.5 sm:px-3 rounded-xl border-2 font-bold text-[12px] sm:text-[13.5px] lg:text-[11.5px] leading-tight transition-all duration-200 cursor-pointer flex-1 flex-grow shrink-0 ${
                                  isLastOnMobile ? 'col-span-2 lg:col-span-1' : ''
                                } ${
                                  isSelected 
                                    ? 'border-primary bg-primary text-white shadow-[0_2px_8px_rgba(17,130,186,0.12)]' 
                                    : 'border-gray-200 text-text-muted hover:border-primary/40 bg-white hover:bg-blue-soft/50 hover:text-text-muted'
                                }`}
                              >
                                {timeframe}
                              </button>
                            );
                          })}
                        </div>
                        {errors.dataViagem && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.dataViagem}</span>}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFormStep(1);
                            if (window.innerWidth < 1024) {
                              smoothScrollToTarget("avaliacao");
                            }
                          }}
                          className="w-full sm:w-1/3 min-h-[56px] font-extrabold rounded-xl border-2 border-gray-200 text-text-muted hover:border-gray-300 transition-all duration-200 bg-white"
                        >
                          Voltar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (validateStep2()) {
                              setFormStep(3);
                              trackEvent("cvi_step_3_started");
                              if (window.innerWidth < 1024) {
                                smoothScrollToTarget("avaliacao");
                              }
                            }
                          }}
                          className="group flex-1 min-h-[62px] font-bold rounded-xl bg-primary hover:bg-primary-dark text-white text-[15px] uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 filter hover:brightness-[0.95]"
                        >
                          <span>Avançar para tutor</span>
                          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: TUTOR AND WHATSAPP */}
                  {formStep === 3 && (
                    <div className="flex flex-col gap-4 animate-fade-in">
                      


                      {/* Nome do tutor with User icon */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="tutor_name" className="text-[13px] font-extrabold text-navy uppercase tracking-wider">Nome do tutor</label>
                        <div className="relative flex items-center">
                          <User className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                          <input 
                            id="tutor_name"
                            name="tutor_name"
                            type="text"
                            placeholder="Digite seu nome completo"
                            autoComplete="name"
                            className={`pl-12 w-full h-[60px] px-4 rounded-xl border bg-white focus:bg-white font-medium text-[16px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/12 focus:border-primary ${errors.nomeTutor ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-200'}`}
                            value={formData.nomeTutor}
                            onChange={(e) => {
                              const value = keepOnlyLettersAndSpaces(e.target.value);
                              setFormData({ ...formData, nomeTutor: value });
                              if (value.trim()) clearFieldErrors("nomeTutor");
                            }}
                          />
                        </div>
                        {errors.nomeTutor && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.nomeTutor}</span>}
                      </div>

                      {/* WhatsApp with Phone icon */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="tutor_phone" className="text-[13px] font-extrabold text-navy uppercase tracking-wider">WhatsApp</label>
                        <div className="relative flex items-center" ref={phoneCountryDropdownRef}>
                          <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={isPhoneCountryOpen}
                            onClick={() => setIsPhoneCountryOpen((open) => !open)}
                            className={`absolute left-2 z-10 flex h-11 items-center gap-1.5 rounded-lg border px-2 text-[12px] font-black transition-all duration-200 ${
                              errors.emailOuTelefone
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-gray-100 bg-blue-soft/45 text-navy hover:border-primary/30 hover:bg-blue-soft"
                            }`}
                          >
                            <DestinationFlag code={selectedPhoneCountry.flagCode} />
                            <span>{selectedPhoneCountry.dialCode}</span>
                            <ChevronDown className={`h-3.5 w-3.5 text-primary transition-transform duration-200 ${isPhoneCountryOpen ? "rotate-180" : ""}`} />
                          </button>
                          <input 
                            id="tutor_phone"
                            name="tutor_phone"
                            type="text"
                            placeholder="11 94245-2218"
                            autoComplete="tel"
                            className={`pl-[132px] w-full h-[60px] px-4 rounded-xl border bg-white focus:bg-white font-medium text-[16px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/12 focus:border-primary ${errors.emailOuTelefone ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-200'}`}
                            value={formData.emailOuTelefone}
                            onChange={(e) => {
                              const nextPhoneCountry = inferPhoneCountryFromTypedDdi(e.target.value, formData.phoneCountry) ?? formData.phoneCountry;
                              setFormData({ ...formData, emailOuTelefone: e.target.value, phoneCountry: nextPhoneCountry });
                              if (normalizePhone(e.target.value, nextPhoneCountry)) clearFieldErrors("emailOuTelefone");
                            }}
                          />
                          {isPhoneCountryOpen && (
                            <div
                              role="listbox"
                              className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 max-h-[290px] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-1.5 shadow-[0_18px_40px_rgba(6,42,87,0.14)]"
                            >
                              {phoneCountryOptions.map((option) => {
                                const isSelected = formData.phoneCountry === option.iso;
                                return (
                                  <button
                                    key={`${option.iso}-${option.label}`}
                                    type="button"
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => {
                                      setFormData({ ...formData, phoneCountry: option.iso });
                                      setIsPhoneCountryOpen(false);
                                      if (normalizePhone(formData.emailOuTelefone, option.iso)) clearFieldErrors("emailOuTelefone");
                                      trackEvent("cvi_phone_country_selected", { country: option.iso, dial_code: option.dialCode });
                                    }}
                                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-all duration-150 ${
                                      isSelected
                                        ? "bg-primary text-white"
                                        : "text-navy hover:bg-blue-soft"
                                    }`}
                                  >
                                    <span className="flex min-w-0 flex-1 items-center gap-3">
                                      <DestinationFlag code={option.flagCode} />
                                      <span className="truncate text-[14px] font-extrabold">{option.label}</span>
                                    </span>
                                    <span className={`text-[13px] font-black ${isSelected ? "text-white" : "text-primary"}`}>{option.dialCode}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {errors.emailOuTelefone && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.emailOuTelefone}</span>}
                      </div>

                      {/* E-mail (Opcional) with outline icon */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="tutor_email" className="text-[13px] font-extrabold text-navy uppercase tracking-wider">E-mail (Opcional)</label>
                        <div className="relative flex items-center">
                          <HelpCircle className="absolute left-4 w-5 h-5 text-gray-400 pointer-events-none" />
                          <input 
                            id="tutor_email"
                            name="tutor_email"
                            type="text"
                            placeholder="Digite seu e-mail"
                            autoComplete="email"
                            className={`pl-12 w-full h-[60px] px-4 rounded-xl border bg-white focus:bg-white font-medium text-[16px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/12 focus:border-primary ${errors.emailOpcional ? 'border-red-500 focus:ring-red-500/10' : 'border-gray-200'}`}
                            value={formData.emailOpcional}
                            onChange={(e) => {
                              setFormData({ ...formData, emailOpcional: e.target.value });
                              if (!e.target.value.trim() || /^\S+@\S+\.\S+$/.test(e.target.value.trim())) clearFieldErrors("emailOpcional");
                            }}
                          />
                        </div>
                        {errors.emailOpcional && <span className="text-red-500 text-xs font-bold mt-0.5">{errors.emailOpcional}</span>}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">
                        <button 
                          type="button" 
                          onClick={() => {
                            setFormStep(2);
                            if (window.innerWidth < 1024) {
                              smoothScrollToTarget("avaliacao");
                            }
                          }}
                          className="w-full sm:w-1/3 min-h-[56px] font-extrabold rounded-xl border-2 border-gray-200 text-text-muted hover:border-gray-300 transition-all duration-200 bg-white"
                        >
                          Voltar
                        </button>
                        <button 
                          type="submit" 
                          className="group flex-1 min-h-[62px] font-bold rounded-xl bg-whatsapp hover:bg-whatsapp-hover text-white text-[15px] uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 animate-btn-pulse hover:-translate-y-0.5 active:scale-[0.98] filter hover:brightness-[0.95]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span>Enviando...</span>
                          ) : (
                            <>
                              <span>Enviar informações</span>
                              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: CONFIRMATION AND WHATSAPP HANDOFF */}
                  {formStep === 4 && (
                    <div id="sucesso-mensagem" className="success-complete flex flex-col gap-5 text-center">
                      <div className="success-complete-icon mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-whatsapp shadow-[0_8px_20px_rgba(5,184,92,0.12)]">
                        <span className="success-complete-ring" />
                        <CheckCircle2 className="relative z-10 h-8 w-8" />
                      </div>

                      <div className="success-complete-item">
                        <h3 className="text-[22px] font-black leading-tight text-navy">
                          Formulário enviado com sucesso
                        </h3>
                        <p className="mt-2 text-[14.5px] font-semibold leading-relaxed text-text-muted">
                          Recebemos suas informações e nossa equipe vai analisar os dados da viagem. Se quiser antecipar o atendimento, clique no botão abaixo para chamar a gente agora no WhatsApp.
                        </p>
                      </div>

                      <div className="success-complete-item rounded-2xl border border-gray-100 bg-blue-soft/35 p-4 text-left">
                        <div className="grid gap-3 text-[13px] font-bold text-navy sm:grid-cols-2">
                          <span><strong className="block text-[10px] uppercase tracking-wider text-text-muted">Origem</strong>{formData.cidadeOrigem}</span>
                          <span><strong className="block text-[10px] uppercase tracking-wider text-text-muted">Destino</strong>{formData.paisDestino === "Outro" ? formData.paisDestinoOutro : formData.paisDestino}</span>
                          <span><strong className="block text-[10px] uppercase tracking-wider text-text-muted">Viagem</strong>{formData.dataViagem}</span>
                          <span><strong className="block text-[10px] uppercase tracking-wider text-text-muted">Tutor</strong>{formData.nomeTutor}</span>
                          <span><strong className="block text-[10px] uppercase tracking-wider text-text-muted">WhatsApp</strong>{formData.emailOuTelefone}</span>
                          <span><strong className="block text-[10px] uppercase tracking-wider text-text-muted">Pet</strong>{confirmationPetSummary}</span>
                          {formData.racaPet.trim() && (
                            <span><strong className="block text-[10px] uppercase tracking-wider text-text-muted">Raça</strong>{formData.racaPet.trim()}</span>
                          )}
                          {formData.procedimentosVeterinarios.length > 0 && (
                            <span><strong className="block text-[10px] uppercase tracking-wider text-text-muted">Procedimentos</strong>{formData.procedimentosVeterinarios.join(", ")}</span>
                          )}
                        </div>
                      </div>

                      <a
                        href={submittedWhatsAppUrl || "https://wa.me/5511942452218"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="success-complete-item group flex min-h-[62px] w-full items-center justify-center gap-2 rounded-xl bg-whatsapp text-[15px] font-black uppercase tracking-wide text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-whatsapp-hover active:scale-[0.98]"
                      >
                        <WhatsAppIcon className="h-5 w-5" />
                        <span>Comece agora seu atendimento</span>
                      </a>

                    </div>
                  )}

                  {/* Footer microtext */}
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="flex items-center justify-center gap-2.5 text-left select-none py-0.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[12px] text-text-muted font-bold leading-none">
                      Seus dados estão protegidos com segurança.
                    </span>
                  </div>

                  <p className="text-center text-[10.5px] text-text-muted/80 leading-none">
                    Ao continuar, você concorda com nossa{" "}
                    <a href="/politica-de-privacidade" className="underline hover:text-primary transition-colors font-bold">
                      Política de Privacidade
                    </a>.
                  </p>

                </form>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            AUTHORITY SECTION
            ========================================== */}
        <section className="bg-white py-12 md:py-20 overflow-hidden">
          <div className="container-custom mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="w-full lg:w-[46%] flex flex-col items-center lg:items-start text-center lg:text-left">
              <span className="inline-block bg-blue-soft text-primary-dark font-extrabold text-[11px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-border">
                SUPORTE ESPECIALIZADO
              </span>

              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] font-[850] leading-[1.1] text-navy mb-6 tracking-tight max-w-[480px]">
                Especialistas em CVI para cães e gatos
              </h2>
              <p className="text-[15px] sm:text-[16px] md:text-[18px] text-text-main leading-[1.6] mb-8 max-w-[500px]">
                Nossa equipe cuida de todo o processo com experiência e atenção aos mínimos detalhes para que tudo saia perfeito.
              </p>

              <div className="flex flex-col gap-4 text-left w-full max-w-[460px]">
                {[
                  "Profissionais com experiência em documentação pet",
                  "Atendimento próximo e humanizado via WhatsApp",
                  "Foco total na segurança do seu pet"
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="micro-card flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-blue-soft/20"
                  >
                    <CheckCircle2 className="w-5 h-5 text-whatsapp flex-shrink-0" />
                    <span className="text-[14px] sm:text-[14.5px] font-bold text-navy leading-tight">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[54%] relative mt-6 lg:mt-0 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[640px] aspect-[4/3.2] lg:aspect-[1.05] overflow-hidden rounded-[32px] select-none">
                <img 
                  src="/assets/especialista-com-pet.png" 
                  alt="Especialista em CVI com cão" 
                  className="w-full h-full object-cover"
                />
                {/* Heavy Radial Fade Mask (center is transparent, fades completely to solid white at 72% radius) */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0)_20%,rgba(255,255,255,0.45)_55%,rgba(255,255,255,1)_72%,rgba(255,255,255,1)_100%)] pointer-events-none z-10" />
                {/* Additional edge-blocking linear fades for absolute background blending */}
                <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-white via-white/40 to-transparent pointer-events-none z-15" />
                <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none z-15" />
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none z-15" />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none z-15" />
              </div>
            </div>
          </div>
        </section>

        
        {/* ==========================================
            TESTIMONIALS SECTION (Histórias de Embarque)
            ========================================== */}
        <section className="bg-gray-50/30 py-12 md:py-24 border-t border-b border-gray-100 overflow-hidden select-none">
          <div className="container-custom mx-auto text-center mb-8 md:mb-14">
            <span className="inline-block bg-blue-soft text-primary-dark font-extrabold text-[11px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-border">
              DEPOIMENTOS DOS TUTORES
            </span>
            <h2 className="text-[27px] sm:text-[36px] md:text-[42px] font-[850] text-navy tracking-tight leading-tight">
              Histórias de Embarque
            </h2>
          </div>

          <div className="md:hidden flex flex-col gap-4 w-full relative">
            <div className="absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-gray-50/95 to-transparent z-25 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-l from-gray-50/95 to-transparent z-25 pointer-events-none" />

            <div className="w-full overflow-hidden">
              <div className="flex w-max gap-4 py-1 animate-marquee-half testimonials-marquee-track">
                {embarkTestimonialsTopLoop.map((testimonial, idx) => (
                  <div key={`mobile-top-${idx}`} className="w-[280px] min-[390px]:w-[300px] shrink-0">
                    <EmbarkTestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full overflow-hidden">
              <div className="flex w-max gap-4 py-1 animate-marquee-half-reverse testimonials-marquee-track">
                {embarkTestimonialsBottomLoop.map((testimonial, idx) => (
                  <div key={`mobile-bottom-${idx}`} className="w-[280px] min-[390px]:w-[300px] shrink-0">
                    <EmbarkTestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-6 w-full relative">
            {/* Gradients on the edges for a fade-out shadow effect */}
            <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-25 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-25 pointer-events-none" />

            {/* Row 1: Scrolls Left */}
            <div className="w-full overflow-hidden">
              <div className="flex w-max gap-6 py-1 animate-marquee-half testimonials-marquee-track">
                {embarkTestimonialsTopLoop.map((testimonial, idx) => (
                  <EmbarkTestimonialCard key={`top-${idx}`} testimonial={testimonial} />
                ))}
              </div>
            </div>

            {/* Row 2: Scrolls Right */}
            <div className="w-full overflow-hidden">
              <div className="flex w-max gap-6 py-1 animate-marquee-half-reverse testimonials-marquee-track">
                {embarkTestimonialsBottomLoop.map((testimonial, idx) => (
                  <EmbarkTestimonialCard key={`bottom-${idx}`} testimonial={testimonial} />
                ))}
              </div>
            </div>
          </div>
        </section>
  

        {/* ==========================================
            GUARANTEE SECTION
            ========================================== */}
        <section className="bg-white py-12 md:py-16">
          <div className="container-custom mx-auto">
            <div className="micro-card max-w-4xl mx-auto bg-[#eef8fc] rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left shadow-[0_8px_30px_rgba(17,130,186,0.04)]">
              <div className="shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white flex items-center justify-center border border-gray-200 shadow-[0_4px_12px_rgba(6,42,87,0.02)]">
                  <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
              </div>

              <div className="flex-1">
                <span className="inline-block bg-primary/10 text-primary-dark font-extrabold text-[10px] uppercase tracking-[0.2em] px-3.5 py-1.5 rounded-full mb-3">
                  GARANTIA CVI Fácil
                </span>
                <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-extrabold text-navy leading-tight mb-3 tracking-tight">
                  Garantia de Paz Mental
                </h2>
                <p className="text-[14.5px] sm:text-[15.5px] text-text-main leading-[1.6] mb-3 font-bold">
                  Seu processo será conduzido por especialistas até a emissão do CVI com segurança, responsabilidade e total suporte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            FAQ SECTION
            ========================================== */}
        <section id="faq" className="bg-white py-12 md:py-24">
          <div className="container-custom mx-auto">
            {/* Centered Heading */}
            <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
              <span className="inline-block bg-blue-soft text-primary-dark font-extrabold text-[11px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-border">
                TUTORES COM DÚVIDAS
              </span>
              <h2 className="text-[27px] sm:text-[36px] md:text-[42px] font-[850] text-navy tracking-tight leading-tight">
                Perguntas Frequentes
              </h2>
            </div>

            {/* Centered Single-Column Accordion */}
            <div className="max-w-3xl mx-auto flex flex-col gap-3.5 md:gap-4">
              {faqs.map((faq, originalIndex) => {
                const isOpen = faqOpenIndex === originalIndex;
                return (
                  <div 
                    key={originalIndex} 
                    className={`rounded-2xl transition-all duration-300 border ${
                      isOpen 
                        ? "bg-white border-primary/20 shadow-[0_4px_20px_rgba(17,130,186,0.03)]" 
                        : "bg-white border-gray-200/70 hover:border-gray-300"
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full min-h-[64px] flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none rounded-2xl"
                      onClick={() => setFaqOpenIndex(isOpen ? null : originalIndex)}
                    >
                      <span className="font-extrabold text-[16px] text-navy pr-4 leading-snug">
                        {faq.question}
                      </span>
                      <div className={`w-10 h-10 rounded-full bg-blue-soft flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10' : 'rotate-0'}`}>
                        <ChevronDown className="w-4 h-4 text-primary" />
                      </div>
                    </button>
                    
                    <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[300px] opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"}`}>
                      <div className="h-px bg-gray-100 mb-4" />
                      <p className="text-[15px] text-text-main leading-[1.65]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>



          </div>
        </section>
    

        {/* ==========================================
            CTA SECTION (FINAL ACCEL)
            ========================================== */}
        <section className="bg-blue-section py-12 md:py-20 relative overflow-hidden">
          
          

          <div className="container-custom mx-auto relative z-10 text-center px-4 flex flex-col items-center">
            <h2 className="text-[28px] sm:text-[38px] md:text-[44px] font-[850] text-white leading-tight mb-4 tracking-tight max-w-[700px]">
              A viagem do seu pet começa no destino certo
            </h2>
            <p className="text-[16px] sm:text-[18px] text-blue-50 leading-[1.65] mb-7 max-w-[580px]">
              Conte com quem entende de CVI para levar seu melhor amigo ainda mais longe.
            </p>
            <a 
              href="#avaliacao" 
              onClick={(e) => handleSmoothScroll(e, "avaliacao")}
              className="group w-full sm:w-[320px] inline-flex items-center justify-center font-[900] rounded-xl transition-all duration-200 bg-whatsapp hover:bg-whatsapp-hover text-white h-14 text-[15px] uppercase tracking-wide gap-2 animate-btn-pulse hover:scale-102 active:scale-[0.98]"
            >
              <span>Iniciar meu CVI</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </section>

      

  </main>

      {/* ==========================================
          FOOTER
          ========================================== */}
      <footer className="bg-white pt-12 md:pt-16 pb-32 md:pb-8 border-t border-border">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
            
            {/* Col 1: Brand */}
            <div className="flex flex-col">
              <div className="w-[140px] h-[40px] mb-6 flex items-center">
                <img
                  src="/assets/logo-cvi-facil.png"
                  alt="CVI Fácil"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <p className="text-[14px] text-text-main leading-[1.6] mb-6">
                Orientação e acompanhamento para organizar o CVI do seu pet sem complicação.
              </p>
            </div>

            {/* Col 2: Service details */}
            <div className="flex flex-col">
              <h4 className="text-[16px] font-[800] text-navy mb-6 uppercase">
                Atendimento
              </h4>
              <ul className="flex flex-col gap-3 text-[14px] text-text-main">
                <li>
                  <strong>WhatsApp:</strong>{" "}
                  <a href="https://wa.me/5511942452218" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    (11) 94245-2218
                  </a>
                </li>
                <li>
                  <strong>E-mail:</strong>{" "}
                  <a href="mailto:contato@cvifacil.com.br" className="hover:text-primary transition-colors">
                    contato@cvifacil.com.br
                  </a>
                </li>
                <li><strong>Horário:</strong> Seg a Sex, 09h às 18h</li>
              </ul>
            </div>

            {/* Col 3: Institutional Links */}
            <div className="flex flex-col">
              <h4 className="text-[16px] font-[800] text-navy mb-6 uppercase">
                Institucional
              </h4>
              <ul className="flex flex-col gap-3 text-[14px] text-text-main">
                <li><a href="#home" className="hover:text-primary transition-colors">Quem somos</a></li>
                <li><a href="/politica-de-privacidade" className="hover:text-primary transition-colors">Política de Privacidade</a></li>
                <li><a href="/termos-de-uso" className="hover:text-primary transition-colors">Termos de Uso</a></li>
              </ul>
            </div>

            {/* Col 4: Legal Disclaimer */}
            <div className="flex flex-col">
              <h4 className="text-[16px] font-[800] text-navy mb-6 uppercase">
                Aviso legal
              </h4>
              <p className="text-[12px] text-text-muted leading-[1.6]">
                A CVI Fácil é uma empresa privada de orientação e acompanhamento documental. Não representamos órgãos oficiais ou ministérios do Governo Federal. A emissão final do CVI é de responsabilidade das autoridades sanitárias competentes.
              </p>
            </div>

          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <span className="text-[12px] text-text-muted">
              &copy; {currentYear} CVI Fácil. Todos os direitos reservados.
            </span>
            <span className="text-[12px] text-text-muted select-all">
              CNPJ: 29.922.919/0001-14
            </span>
          </div>
        </div>
      </footer>

      {/* ==========================================
          FLOATING ELEMENTS & CRO WIDGETS
          ========================================== */}
      {/* Desktop Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:block">
        <a
          href="#avaliacao"
          onClick={(e) => handleSmoothScroll(e, "avaliacao")}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_24px_rgba(5,184,92,0.28)] transition-all duration-300 hover:scale-105 hover:bg-whatsapp-hover active:scale-95"
          aria-label="Iniciar atendimento"
        >
          <MessageSquare className="h-6 w-6 transition-transform duration-300 group-hover:scale-105" />
        </a>
      </div>

      {/* Mobile Sticky Bar */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-all duration-300 ${
        scrolled ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}>
        <a 
          href="#avaliacao"
          onClick={(e) => handleSmoothScroll(e, "avaliacao")}
          className="group flex items-center justify-center w-full min-h-[52px] bg-whatsapp text-white font-extrabold rounded-xl hover:bg-whatsapp-hover transition-all gap-2 active:scale-[0.98]"
        >
          <span>Iniciar meu CVI</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>




      {/* Floating Notification Popup */}
      <div 
        className={`fixed bottom-24 left-3 right-3 z-40 mx-auto max-w-[292px] transition-all duration-500 pointer-events-none md:left-6 md:right-auto md:mx-0 md:max-w-[310px] ${
          notification.visible 
            ? "translate-y-0 opacity-100 scale-100" 
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        <div className="pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-emerald-100/80 bg-white/92 p-3 font-sans shadow-[0_10px_28px_rgba(6,42,87,0.08)] backdrop-blur-md">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-whatsapp/10 text-whatsapp">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center justify-between gap-3">
              <span className="text-[11px] font-[850] leading-none tracking-[-0.01em] text-whatsapp">CVI Fácil</span>
              <span className="shrink-0 text-[10px] font-semibold leading-none text-text-muted/55">agora</span>
            </div>
            <p className="text-[12px] font-semibold leading-snug tracking-[-0.01em] text-navy/85 md:text-[12.5px]">
              CVI de <strong className="font-[850] text-navy">{notification.name}</strong> emitido para {notification.dest}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// ==========================================
// HELPERS & SUB-DATA
// ==========================================

  // Custom user-provided PNG pictures for the step hovers

  
const StarIcon = () => (
  <svg className="w-4 h-4 fill-[var(--color-star)] text-[var(--color-star)]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.87 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
  </svg>
);

const comparisonData = [
  { feature: "Entender as exigências do país", diy: "Demorado e confuso", cvi: "Análise personalizada" },
  { feature: "Contar documentos corretos", diy: "Risco de falta ou erro", cvi: "Checklist completo e revisado" },
  { feature: "Preencher formulários", diy: "Pode ser rejeitado", cvi: "Preenchimento técnico sem erros" },
  { feature: "Acompanhar prazos", diy: "Fácil perder prazos", cvi: "Controle e lembretes automáticos" },
  { feature: "Falar com o MAPA", diy: "Dificuldade e espera", cvi: "Intermediação e suporte" },
  { feature: "Tranquilidade na viagem", diy: "Preocupação constante", cvi: "Viagem segura e tranquila" }
];

const faqs = [
  {
    question: "Quanto tempo antes da viagem devo começar a organizar a documentação?",
    answer: "É recomendável iniciar pelo menos 60 a 90 dias antes do embarque. Alguns destinos (como Japão e União Europeia) exigem o exame de sorologia de raiva, que tem um período obrigatório de espera de 90 dias após a coleta de sangue antes de emitir o CVI."
  },
  {
    question: "Quais são os documentos obrigatórios para viajar com cães e gatos?",
    answer: "A maioria dos países exige identificação por microchip eletrônico, carteira de vacinação atualizada (com vacina antirrábica ativa), atestado de saúde assinado por veterinário particular e o CVI (Certificado Veterinário Internacional) oficial."
  },
  {
    question: "Qual a diferença entre o CVI e o Passaporte Pet?",
    answer: "O CVI é emitido gratuitamente pelo MAPA e é obrigatório para quase todos os países. O Passaporte Pet só é aceito para trânsito entre países do Mercosul. Para a Europa, EUA e outros continentes, o CVI impresso oficial continua sendo obrigatório."
  },
  {
    question: "Meu pet precisa de exame de sorologia de raiva?",
    answer: "Depende do destino. Países da União Europeia, Reino Unido, Japão e outros exigem o teste de sorologia feito em um laboratório credenciado. O exame deve ser realizado pelo menos 3 meses antes do embarque."
  },
  {
    question: "O que acontece se a documentação do pet estiver incorreta?",
    answer: "O pet pode ser impedido de embarcar pelas companhias aéreas. Caso consiga viajar, ao chegar no destino o animal pode sofrer quarentena obrigatória com custos altíssimos para o tutor, ou ser deportado de volta ao Brasil."
  },
  {
    question: "A CVI Fácil emite o documento ou faz a assessoria?",
    answer: "Nós fazemos a assessoria completa: revisamos vacinas e exames, orientamos seu veterinário e preenchemos toda a solicitação no sistema oficial do MAPA para garantir que seu processo seja aprovado sem erros."
  }
];

