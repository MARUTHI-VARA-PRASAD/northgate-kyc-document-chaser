// SYNTHETIC APPLICATION STATE
    const docData = [
      {
        id: 1,
        title: "Certificate of Incorporation",
        status: "Missing",
        why: "Verifies legal existence and corporate entity registration in state jurisdiction.",
        action: "Certified copy with ROC registrar stamp",
        bulletName: "1. Certificate of Incorporation (Certified copy with ROC registrar stamp)"
      },
      {
        id: 2,
        title: "Latest Shareholding Structure",
        status: "Missing",
        why: "Mandatory regulatory equity distribution breakdown showing >10% stake holders.",
        action: "CS / Director-signed cap table under 90 days",
        bulletName: "2. Latest Shareholding Structure (Signed by Company Secretary or Director within 90 days)"
      },
      {
        id: 3,
        title: "Ultimate Beneficial Owner (UBO) Identification",
        status: "Missing",
        why: "AML/CFT compliance mandates government identity of natural persons controlling entity.",
        action: "Valid Passport / Aadhaar / National ID copy",
        bulletName: "3. Ultimate Beneficial Owner (UBO) Identification (Valid government photo ID for each >10% holder)"
      },
      {
        id: 4,
        title: "Proof of Registered Business Address",
        status: "Missing",
        why: "Confirms physical operating location for operational risk & tax jurisdiction.",
        action: "Utility bill or Lease deed within last 60 days",
        bulletName: "4. Proof of Registered Business Address (Electricity/utility bill or lease deed dated within 60 days)"
      }
    ];

    let isApproved = false;
    let isCustomEmailEdited = false;

    function byId<T extends HTMLElement = HTMLElement>(id: string): T {
      const element = document.getElementById(id);
      if (!element) {
        throw new Error(`Required element not found: ${id}`);
      }
      return element as T;
    }

    // INITIALIZATION
    document.addEventListener("DOMContentLoaded", () => {
      try {
        const savedState = JSON.parse(localStorage.getItem("northgate-kyc-case") || "null");
        if (savedState && Array.isArray(savedState.documents)) {
          savedState.documents.forEach(savedDoc => {
            const doc = docData.find(item => item.id === savedDoc.id);
            if (doc && (savedDoc.status === "Missing" || savedDoc.status === "Received")) {
              doc.status = savedDoc.status;
            }
          });
          isApproved = savedState.isApproved === true;
          if (isApproved) {
            byId<HTMLInputElement>("chk-review-docs").checked = true;
            byId<HTMLInputElement>("chk-review-email").checked = true;
          }
        }
      } catch (error) {
        console.warn("Saved demo state could not be restored.", error);
      }
      renderState();
      if (isApproved) {
        approveAndMarkReady();
      }
    });

    // INTERACTION 1: TOGGLE DOC STATUS
    function toggleDocStatus(id) {
      const doc = docData.find(d => d.id === id);
      if (!doc) return;

      doc.status = (doc.status === "Missing") ? "Received" : "Missing";
      if (isApproved) {
        resetApprovalStatus();
      }
      renderState();
    }

    function handleDocumentKeydown(event, id) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDocStatus(id);
      }
    }

    // RENDER UI FROM STATE
    function renderState() {
      let missingCount = 0;
      let receivedCount = 0;

      docData.forEach(doc => {
        const card = byId(`doc-card-${doc.id}`);
        const badge = byId(`doc-badge-${doc.id}`);
        const icon = byId(`doc-icon-${doc.id}`);

        if (doc.status === "Received") {
          receivedCount++;
          // Styling for Received
          card.className = "group cursor-pointer border border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-xl p-3 transition-all duration-200 relative";
          badge.className = "px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1";
          badge.innerHTML = `<svg class="w-3 h-3 text-emerald-600 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg> Received`;
          icon.className = "w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[11px]";
          icon.innerHTML = "OK";
          card.setAttribute("aria-pressed", "true");
        } else {
          missingCount++;
          // Styling for Missing
          card.className = "group cursor-pointer border border-rose-200 bg-rose-50/30 hover:bg-rose-50/60 rounded-xl p-3 transition-all duration-200 relative";
          badge.className = "px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-300";
          badge.innerHTML = "Missing";
          icon.className = "w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[11px]";
          icon.innerHTML = String(doc.id);
          card.setAttribute("aria-pressed", "false");
        }
      });

      // Update counters & Progress
      byId("counter-outstanding").textContent = String(missingCount);
      byId("counter-received").textContent = `${receivedCount} of 4`;
      
      const pct = (receivedCount / 4) * 100;
      byId("progress-bar-fill").style.width = `${pct}%`;

      const missingBadge = byId("counter-missing-badge");
      const navStatus = byId("nav-summary-status");
      const caseStatusBadge = byId("badge-case-status");

      if (missingCount === 0) {
        missingBadge.className = "bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-extrabold";
        missingBadge.textContent = "All Cleared";
        navStatus.className = "text-xs font-extrabold text-emerald-700";
        navStatus.textContent = "All 4 Documents Received";
        caseStatusBadge.className = "px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center space-x-1";
        caseStatusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span><span>Ready For Verification</span>`;
      } else {
        missingBadge.className = "bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px] font-extrabold";
        missingBadge.innerHTML = `<span id="counter-outstanding">${missingCount}</span> Outstanding`;
        navStatus.className = "text-xs font-extrabold text-rose-700";
        navStatus.textContent = `${missingCount} Doc${missingCount > 1 ? 's' : ''} Outstanding`;
        caseStatusBadge.className = "px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center space-x-1";
        caseStatusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span><span>Documents Pending</span>`;
      }

      // Re-generate email preview only if user hasn't explicitly overridden with custom manual edit
      if (!isCustomEmailEdited) {
        generateEmailText(missingCount);
      }

      localStorage.setItem("northgate-kyc-case", JSON.stringify({
        documents: docData.map(doc => ({ id: doc.id, status: doc.status })),
        isApproved
      }));
    }

    // DYNAMIC EMAIL TEXT GENERATOR
    function generateEmailText(missingCount) {
      const clientName = "Apex Manufacturing Pvt. Ltd.";
      const caseRef = "NG-KYC-2026-001";
      const rmName = "Priya Sharma";

      const missingDocs = docData.filter(d => d.status === "Missing");
      
      let docListText = "";
      if (missingDocs.length > 0) {
        docListText = missingDocs.map(d => `  - ${d.title}\n    Action: ${d.action}\n    Requirement: ${d.why}`).join("\n\n");
      } else {
        docListText = "  [None: All outstanding onboarding documents have been received in good order.]";
      }

      const emailBody = 
`Dear Mr. Singhania & Corporate Team,

Re: Corporate KYC Onboarding - ${clientName}
Case Reference: ${caseRef}

Thank you for partnering with Northgate Commercial Banking. 

To complete your corporate onboarding and activate your institutional facilities smoothly, our compliance desk has conducted an upfront consolidated review. 

${missingDocs.length > 0 
? `We have identified the following ${missingDocs.length} outstanding document(s) required to finalize verification:`
: `All previously pending onboarding documents have now been received and transferred to legal clearance.`}

${docListText}

SUBMISSION INSTRUCTIONS:
1. Please upload high-resolution certified PDFs via the Northgate Secure Client Portal: https://portal.northgate.bank/onboard/${caseRef}
2. Alternatively, you may reply directly to this email with all attached files consolidated in a single bundle.

We kindly request submission by Thursday, 12 November 2026 to prevent onboarding delays and activate your treasury services on schedule.

Should you have any questions or require statutory clarifications, please contact me directly.

Warm regards,

${rmName}
Lead Relationship Manager | Commercial Banking
Northgate Institutional Banking Division
Direct: +91 22 6940 8820 | Desk Ref: PS-KYC-DESK-4`;

      byId<HTMLTextAreaElement>("email-body-textarea").value = emailBody;
      
      // Update subject line
      if (missingDocs.length > 0) {
        byId<HTMLInputElement>("email-subject-input").value = `Action Required: Pending KYC Documents (${missingDocs.length} outstanding) - ${clientName} (Ref: ${caseRef})`;
      } else {
        byId<HTMLInputElement>("email-subject-input").value = `Update: KYC Documentation Received in Full - ${clientName} (Ref: ${caseRef})`;
      }
    }

    function handleManualEmailEdit() {
      isCustomEmailEdited = true;
    }

    function regenerateEmailDraft() {
      isCustomEmailEdited = false;
      const missingCount = docData.filter(d => d.status === "Missing").length;
      generateEmailText(missingCount);
    }

    function copyEmailText() {
      const textarea = byId<HTMLTextAreaElement>("email-body-textarea");
      textarea.select();
      const showCopyToast = () => {
        const toast = byId("copy-toast");
        toast.classList.remove("hidden");
        setTimeout(() => toast.classList.add("hidden"), 4000);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textarea.value).then(showCopyToast).catch(() => {
          document.execCommand("copy");
          showCopyToast();
        });
      } else {
        document.execCommand("copy");
        showCopyToast();
      }
    }

    // RM APPROVAL VALIDATION & WORKFLOW
    function validateApprovalState() {
      const chk1 = byId<HTMLInputElement>("chk-review-docs").checked;
      const chk2 = byId<HTMLInputElement>("chk-review-email").checked;
      const btn = byId<HTMLButtonElement>("btn-approve");
      const hint = byId("approval-hint");

      if (chk1 && chk2 && !isApproved) {
        btn.disabled = false;
        btn.className = "w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer";
        hint.textContent = "Ready: All human verification checks confirmed.";
        hint.className = "text-[10px] text-center text-emerald-600 font-semibold";
      } else if (!isApproved) {
        btn.disabled = true;
        btn.className = "w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center space-x-2 bg-slate-300 cursor-not-allowed shadow-none";
        hint.textContent = "Complete both review checkboxes above to enable authorization.";
        hint.className = "text-[10px] text-center text-slate-400";
      }
    }

    function approveAndMarkReady() {
      if (isApproved) return;
      if (!byId<HTMLInputElement>("chk-review-docs").checked || !byId<HTMLInputElement>("chk-review-email").checked) {
        validateApprovalState();
        return;
      }
      isApproved = true;
      const btn = byId<HTMLButtonElement>("btn-approve");
      const btnLabel = byId("btn-approve-label");
      const statusBadge = byId("rm-status-badge");
      const statusText = byId("rm-status-text");
      const banner = byId("approval-success-banner");

      btn.disabled = true;
      btn.className = "w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-800 cursor-default shadow-xs flex items-center justify-center space-x-2";
      btnLabel.textContent = "Approved & Ready for Dispatch";

      statusBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1.5";
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-500"></span><span id="rm-status-text">Ready to Send</span>`;

      banner.classList.remove("hidden");
      localStorage.setItem("northgate-kyc-case", JSON.stringify({
        documents: docData.map(doc => ({ id: doc.id, status: doc.status })),
        isApproved
      }));
    }

    function resetApprovalStatus() {
      isApproved = false;
      byId<HTMLInputElement>("chk-review-docs").checked = false;
      byId<HTMLInputElement>("chk-review-email").checked = false;
      byId("approval-success-banner").classList.add("hidden");
      
      const statusBadge = byId("rm-status-badge");
      statusBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1.5";
      statusBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-500"></span><span id="rm-status-text">Pending Review</span>`;

      const btnLabel = byId("btn-approve-label");
      btnLabel.textContent = "Approve & Mark Ready to Send";

      validateApprovalState();
      localStorage.setItem("northgate-kyc-case", JSON.stringify({
        documents: docData.map(doc => ({ id: doc.id, status: doc.status })),
        isApproved
      }));
    }

    function resetAllDocs() {
      docData.forEach(d => d.status = "Missing");
      isCustomEmailEdited = false;
      if (isApproved) {
        resetApprovalStatus();
      }
      renderState();
    }

    function scrollToSection(elemId) {
      const el = byId(elemId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // RM CALL SIMULATION MODAL
    function triggerSimulatedCallModal() {
      byId("call-log-modal").classList.remove("hidden");
    }
    function closeCallModal() {
      byId("call-log-modal").classList.add("hidden");
    }
    function saveCallLog() {
      closeCallModal();
      const label = byId("label-last-response");
      label.className = "font-semibold text-emerald-700 text-[11px] flex items-center";
      label.innerHTML = `<svg class="w-3 h-3 text-emerald-600 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg> Phone Follow-up Logged (CFO Contacted)`;
      const toast = byId("copy-toast");
      toast.textContent = "Follow-up logged. Three-day SLA timer reset.";
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 4000);
    }

    Object.assign(window, {
      toggleDocStatus,
      handleDocumentKeydown,
      resetAllDocs,
      copyEmailText,
      regenerateEmailDraft,
      handleManualEmailEdit,
      validateApprovalState,
      approveAndMarkReady,
      resetApprovalStatus,
      triggerSimulatedCallModal,
      closeCallModal,
      saveCallLog,
      scrollToSection
    });
