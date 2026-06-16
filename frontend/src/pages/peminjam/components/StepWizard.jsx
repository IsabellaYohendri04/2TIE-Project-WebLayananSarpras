import React from "react";

export function StepWizard({ steps, currentStep }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between relative px-2">
        <div className="absolute top-5 left-4 right-4 h-1 bg-slate-200/80 rounded-full" />
        <div
          className="absolute top-5 left-4 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2rem)`,
            maxWidth: "calc(100% - 2rem)",
          }}
        />
        {steps.map((step) => {
          const active = currentStep === step.id;
          const done = currentStep > step.id;
          return (
            <div key={step.id} className="flex flex-col items-center z-10 flex-1 min-w-0">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                  active
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/40 scale-110 ring-4 ring-violet-200"
                    : done
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-white border-2 border-slate-200 text-slate-400"
                }`}
              >
                {done ? "✓" : step.icon}
              </div>
              <span
                className={`text-[11px] mt-2 font-semibold text-center hidden sm:block truncate max-w-full px-1 ${
                  active ? "text-violet-600" : done ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ModernCard({
  onClick,
  disabled,
  icon,
  title,
  subtitle,
  badge,
  accent = "violet",
  selected,
}) {
  const accents = {
    violet: "hover:border-violet-400 hover:shadow-violet-200/50 hover:shadow-xl",
    blue: "hover:border-blue-400 hover:shadow-blue-200/50 hover:shadow-xl",
    emerald: "hover:border-emerald-400 hover:shadow-emerald-200/50 hover:shadow-xl",
    amber: "hover:border-amber-400 hover:shadow-amber-200/50 hover:shadow-xl",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative text-left p-6 rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
        disabled
          ? "border-slate-100 opacity-45 cursor-not-allowed bg-slate-50"
          : selected
            ? "border-violet-500 bg-violet-50/80 shadow-lg shadow-violet-200/40"
            : `border-slate-200/80 bg-white/90 backdrop-blur ${accents[accent]}`
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-violet-50/0 group-hover:to-violet-50/30 transition-colors pointer-events-none" />
      <div className="relative">
        <div className="flex justify-between items-start gap-2">
          <span className="text-4xl">{icon}</span>
          {badge && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-violet-100 group-hover:text-violet-700 transition-colors">
              {badge}
            </span>
          )}
        </div>
        <h3 className="font-bold text-gray-900 mt-3 text-lg">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{subtitle}</p>}
      </div>
    </button>
  );
}

export function FloorPicker({ floors, selected, onSelect, label = "Pilih Lantai" }) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{label}</h3>
      <div className="flex flex-wrap gap-3">
        {floors.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onSelect(f)}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
              selected === f
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30 scale-105"
                : "bg-white border-2 border-slate-200 text-gray-700 hover:border-violet-300 hover:bg-violet-50"
            }`}
          >
            Lantai {f}
          </button>
        ))}
      </div>
    </div>
  );
}
