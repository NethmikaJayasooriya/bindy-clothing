"use client";

import React, { useState, useEffect } from "react";
import {
  getSellerPayouts,
  SellerPayout,
  ADMIN_EVENTS
} from "@/lib/adminData";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<SellerPayout[]>([]);

  useEffect(() => {
    setPayouts(getSellerPayouts());
  }, []);

  const totalPaidOut = payouts
    .filter(p => p.status === "Settled")
    .reduce((sum, p) => sum + p.netPayoutAud, 0);

  const pendingPayout = payouts
    .filter(p => p.status === "Processing" || p.status === "Upcoming")
    .reduce((sum, p) => sum + p.netPayoutAud, 0);

  const totalFairWageFund = payouts.reduce((sum, p) => sum + p.artisanFairWageDeductionAud, 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#24221F]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#FAF7F2] font-light tracking-wide">
            Seller Payouts & Settlement Ledger
          </h1>
          <p className="text-xs font-mono text-[#8A857D] mt-1.5">
            Transparent revenue distribution, Commonwealth Bank of Australia (CBA) settlements, and Sri Lankan Artisan Living Wage deductions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => alert("Remittance CSV exported for Australian Tax Office (ATO) reporting.")}
            className="px-3.5 py-2 rounded-lg bg-[#1F1E1B] hover:bg-[#282622] border border-[#2E2C28] text-xs font-mono text-[#DFBF7A] transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export ATO Tax CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724]">
          <span className="text-xs font-mono text-[#8A857D] block">SETTLED TO DATE (AUD)</span>
          <div className="mt-2 font-serif text-3xl text-[#FAF7F2]">
            ${totalPaidOut.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
            ✓ Transferred via CBA FastPay
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724]">
          <span className="text-xs font-mono text-[#8A857D] block">SCHEDULED DISBURSEMENT</span>
          <div className="mt-2 font-serif text-3xl text-[#DFBF7A]">
            ${pendingPayout.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] font-mono text-[#8A857D] mt-1 block">
            Next payout: 15 March 2026
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#161513] border border-[#292724]">
          <span className="text-xs font-mono text-[#8A857D] block">ARTISAN FAIR WAGE FUND</span>
          <div className="mt-2 font-serif text-3xl text-emerald-400">
            ${totalFairWageFund.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] font-mono text-[#8A857D] mt-1 block">
            15% direct allocation to SL Looms
          </span>
        </div>
      </div>

      {/* Banking Details Banner */}
      <div className="p-4 rounded-xl bg-[#1A1918] border border-[#2C2A26] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#DFBF7A] font-serif font-bold">
            AU
          </div>
          <div>
            <div className="text-xs font-mono text-[#FAF7F2]">Direct Deposit: Commonwealth Bank of Australia (CBA)</div>
            <div className="text-[11px] font-mono text-[#8A857D]">
              BSB: <span className="text-[#FAF7F2]">063-000</span> · Account: <span className="text-[#FAF7F2]">•••• 9104</span> · Bindy Atelier Australia Pty Ltd
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-800/40">
            Automated Bi-Weekly Cycle
          </span>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="rounded-xl bg-[#161513] border border-[#292724] overflow-hidden">
        <div className="p-4 border-b border-[#292724] flex items-center justify-between">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#FAF7F2]">
            Historical Settlement Ledger
          </h2>
          <span className="text-xs font-mono text-[#8A857D]">AUD Currency</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#292724] bg-[#1A1918] text-[11px] font-mono text-[#8A857D] uppercase tracking-wider">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-3 text-right">Gross Sales</th>
                <th className="py-3 px-3 text-right">Artisan Fund (15%)</th>
                <th className="py-3 px-3 text-right">Platform Fee (3%)</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#21201D] text-xs font-mono">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-[#1B1A18] transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#FAF7F2]">{p.reference}</td>
                  <td className="py-3.5 px-4 text-[#A8A39A]">{p.period}</td>
                  <td className="py-3.5 px-3 text-right text-[#FAF7F2]">
                    ${p.grossSalesAud.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-3 text-right text-emerald-400">
                    -${p.artisanFairWageDeductionAud.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-3 text-right text-[#8A857D]">
                    -${p.platformFeeAud.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-[#DFBF7A]">
                    ${p.netPayoutAud.toLocaleString("en-AU", { minimumFractionDigits: 2 })} AUD
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-mono border ${
                      p.status === "Settled"
                        ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/40"
                        : p.status === "Processing"
                        ? "bg-amber-950/60 text-amber-300 border-amber-800/40"
                        : "bg-[#252320] text-[#A8A39A] border-[#3D3A35]"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
