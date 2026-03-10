import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const LANGS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "te", label: "Telugu" },
  { code: "kn", label: "Kannada" },
];

export function TranslatableField({ label, value = {}, onChange, multiline = false, rows = 3, placeholder = "" }) {
  const [activeLang, setActiveLang] = useState("en");
  const val = typeof value === 'string' ? { en: value } : (value || {});

  const handleChange = (lang, text) => {
    onChange({ ...val, [lang]: text });
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex gap-1 mb-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code)}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
              activeLang === l.code
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {l.code.toUpperCase()}
          </button>
        ))}
      </div>
      {multiline ? (
        <Textarea
          rows={rows}
          value={val[activeLang] || ""}
          onChange={(e) => handleChange(activeLang, e.target.value)}
          placeholder={placeholder || `${label || "Text"} (${LANGS.find(l => l.code === activeLang)?.label})`}
          className="rounded-lg text-sm"
        />
      ) : (
        <Input
          value={val[activeLang] || ""}
          onChange={(e) => handleChange(activeLang, e.target.value)}
          placeholder={placeholder || `${label || "Text"} (${LANGS.find(l => l.code === activeLang)?.label})`}
          className="rounded-lg text-sm"
        />
      )}
    </div>
  );
}

export function TranslatableListField({ label, value = {}, onChange, placeholder = "" }) {
  const [activeLang, setActiveLang] = useState("en");
  const val = typeof value === 'object' && !Array.isArray(value) ? value : { en: [] };

  const handleChange = (lang, text) => {
    const items = text.split("\n");
    onChange({ ...val, [lang]: items });
  };

  const currentList = Array.isArray(val[activeLang]) ? val[activeLang] : [];

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <div className="flex gap-1 mb-1">
        {LANGS.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => setActiveLang(l.code)}
            className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
              activeLang === l.code
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {l.code.toUpperCase()}
          </button>
        ))}
      </div>
      <Textarea
        rows={5}
        value={currentList.join("\n")}
        onChange={(e) => handleChange(activeLang, e.target.value)}
        placeholder={placeholder || `One item per line (${LANGS.find(l => l.code === activeLang)?.label})`}
        className="rounded-lg text-sm font-mono"
      />
    </div>
  );
}

export { LANGS };
