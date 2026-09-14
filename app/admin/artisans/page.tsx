"use client";

import React, { useState, useEffect } from "react";
import {
  getLoomWorkshops,
  LoomWorkshop,
  ADMIN_EVENTS
} from "@/lib/adminData";

export default function AdminArtisansPage() {
  const [workshops, setWorkshops] = useState<LoomWorkshop[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<LoomWorkshop | null>(null);
  const [editingYardage, setEditingYardage] = useState<number>(0);

  useEffect(() => {
    setWorkshops(getLoomWorkshops());
  }, []);

  const totalWeavers = workshops.reduce((sum, w) => sum + w.activeWeaversCount, 0);
  const totalMetersWoven = workshops.reduce((sum, w) => sum + w.completedYardageMeters, 0);
  const totalMetersTarget = workshops.reduce((sum, w) => sum + w.targetYardageMeters, 0);
  const overallProgress = totalMetersTarget > 0 ? Math.round((totalMetersWoven / totalMetersTarget) * 100) : 0;

  const handleUpdateYardage = (workshopId: string, addMeters: number) => {
    const updated = workshops.map(w => {
      if (w.id === workshopId) {
        const newCompleted = Math.min(w.targetYardageMeters, w.completedYardageMeters + addMeters);
        const newPercent = Math.round((newCompleted / w.targetYardageMeters) * 100);
        let newStatus = w.status;
        if (newPercent >= 100) newStatus = "Ready for Sea/Air Freight";
        else if (newPercent >= 85) newStatus = "Finishing & Inspection";
        return {
          ...w,
          completedYardageMeters: newCompleted,
          progressPercent: newPercent,
          status: newStatus
        };
      }
      return w;
    });

    setWorkshops(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("bindy_admin_workshops", JSON.stringify(updated));
      window.dispatchEvent(new Event(ADMIN_EVENTS.PRODUCTS_UPDATED));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24221F]">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-light tracking-wide">
              Sri Lankan Ancestral Pit-Loom Workshops
            </h1>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 tracking-wider flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ethical Supply Chain</span>
            </span>
          </div>
          <p className="text-xs font-mono text-[#8A857D] mt-1.5">
            Direct production tracking from handloom centers in Gampaha, Kandy, and Kurunegala districts.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-3 py-1.5 rounded-lg bg-[#1F1E1B] border border-[#2E2C28] text-[#DFBF7A]">
            Living Wage Verified: <strong>+213% vs SL Standard</strong>
          </span>
        </div>
      </div>

      {/* Impact & Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724]">
          <span className="text-xs font-mono text-[#8A857D] block">ACTIVE WEAVERS</span>
          <div className="mt-2 font-serif text-3xl text-[#FAF7F2]">
            {totalWeavers} <span className="text-sm font-mono text-[#8A857D]">Artisans</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
            100% Women-led cooperative
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724]">
          <span className="text-xs font-mono text-[#8A857D] block">CURRENT CYCLE YARDAGE</span>
          <div className="mt-2 font-serif text-3xl text-[#FAF7F2]">
            {totalMetersWoven}m <span className="text-sm font-mono text-[#8A857D]">/ {totalMetersTarget}m</span>
          </div>
          <span className="text-[11px] font-mono text-[#C5A059] mt-1 block">
            {overallProgress}% of Australian allocation woven
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724]">
          <span className="text-xs font-mono text-[#8A857D] block">FAIR TRADE LIVING WAGE</span>
          <div className="mt-2 font-serif text-3xl text-[#FAF7F2]">
            $36.00 <span className="text-sm font-mono text-[#8A857D]">AUD/day</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
            Includes healthcare + pension fund
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724]">
          <span className="text-xs font-mono text-[#8A857D] block">CARBON IMPACT</span>
          <div className="mt-2 font-serif text-3xl text-[#FAF7F2]">
            0.00 <span className="text-sm font-mono text-[#8A857D]">kW/h</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
            100% Human kinetic pit-loom power
          </span>
        </div>
      </div>

      {/* Workshop Deep-Dive Cards */}
      <div className="space-y-6">
        <h2 className="text-sm font-mono uppercase tracking-wider text-[#FAF7F2]">
          Active Handloom Guilds & Production Progress
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {workshops.map((workshop) => (
            <div
              key={workshop.id}
              className="rounded-xl bg-[#161513] border border-[#292724] overflow-hidden flex flex-col justify-between"
            >
              {/* Image banner */}
              <div className="relative h-44 bg-[#21201D] overflow-hidden">
                <img
                  src={workshop.image}
                  alt={workshop.name}
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161513] via-[#161513]/40 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[#DFBF7A] border border-[#DFBF7A]/30">
                    {workshop.status}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-serif text-lg text-[#FAF7F2]">{workshop.name}</h3>
                  <p className="text-xs font-mono text-[#C5A059]">{workshop.district} Province · Master {workshop.masterWeaver}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Current Batch & Fabric */}
                  <div className="p-3 bg-[#1A1918] rounded-lg border border-[#2B2925] text-xs font-mono space-y-1">
                    <div className="flex justify-between text-[#8A857D]">
                      <span>Batch:</span>
                      <span className="text-[#FAF7F2] font-medium">{workshop.currentBatchName}</span>
                    </div>
                    <div className="flex justify-between text-[#8A857D]">
                      <span>Fabric:</span>
                      <span className="text-[#DFBF7A]">{workshop.fabricType}</span>
                    </div>
                    <div className="flex justify-between text-[#8A857D]">
                      <span>Specialty:</span>
                      <span className="text-[#FAF7F2]">{workshop.specialty}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#8A857D] mb-1.5">
                      <span>Loom Yardage Completed</span>
                      <span className="text-[#FAF7F2] font-bold">{workshop.progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#272522] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C5A059] to-[#DFBF7A] rounded-full transition-all duration-300"
                        style={{ width: `${workshop.progressPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#787369] mt-1.5">
                      <span>{workshop.completedYardageMeters} meters woven</span>
                      <span>Goal: {workshop.targetYardageMeters} meters</span>
                    </div>
                  </div>

                  {/* Certifications pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {workshop.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#1F1E1B] text-[#A8A39A] border border-[#2E2C28]"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-[#24221F] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] text-[#8A857D]">
                    <span>Air Freight ETA:</span>
                    <span className="text-[#FAF7F2] font-semibold">{workshop.estimatedCompletion}</span>
                  </div>

                  {/* Record Weaved Yardage Buttons */}
                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => handleUpdateYardage(workshop.id, 10)}
                      className="flex-1 py-1.5 px-2 bg-[#201F1C] hover:bg-[#282622] text-[#DFBF7A] border border-[#3A362F] rounded text-[11px] transition-colors text-center"
                    >
                      +10m Woven
                    </button>
                    <button
                      onClick={() => handleUpdateYardage(workshop.id, 25)}
                      className="flex-1 py-1.5 px-2 bg-[#201F1C] hover:bg-[#282622] text-[#DFBF7A] border border-[#3A362F] rounded text-[11px] transition-colors text-center"
                    >
                      +25m Woven
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
