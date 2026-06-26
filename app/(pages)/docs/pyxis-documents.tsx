import type { ComponentType } from "react";
import {
  BulletList,
  Checklist,
  DocumentSection,
  DocumentShell,
  DocumentTable,
  FieldGrid,
  LegalNote,
  Placeholder,
  SignatureBlock,
} from "./DocumentPrimitives";

export type PyxisDocument = {
  slug: string;
  title: string;
  type: string;
  description: string;
  Component: ComponentType;
};

function ProposalDocument() {
  return (
    <DocumentShell
      title="Project Proposal"
    >
      <DocumentSection title="Overview">
        <p>
          Pyxis proposes to partner with <Placeholder>Client Name</Placeholder>{" "}
          to plan, design, and build <Placeholder>Project Name</Placeholder>.
          The goal is to create a polished digital experience that clarifies
          the offer, supports conversion, and gives the client a strong launch
          foundation.
        </p>
      </DocumentSection>
      <DocumentSection title="Project Goals">
        <BulletList
          items={[
            <>Clarify the customer journey and primary conversion action.</>,
            <>Create a sharp visual direction aligned with the brand.</>,
            <>Build a responsive, maintainable implementation.</>,
            <>Prepare launch assets, handoff notes, and support expectations.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Scope and Deliverables">
        <DocumentTable
          headers={["Area", "Deliverables"]}
          rows={[
            ["Strategy", "Discovery call, goals map, sitemap or feature outline."],
            ["Design", "Wireframes, visual direction, responsive page designs."],
            ["Build", "Implementation, integrations, QA, launch preparation."],
            ["Handoff", "Source files, assets, documentation, and final walkthrough."],
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Timeline and Investment">
        <FieldGrid
          fields={[
            { label: "Estimated timeline", value: <Placeholder>Timeline</Placeholder> },
            { label: "Total fee", value: <Placeholder>Total Fee</Placeholder> },
            { label: "Deposit", value: <Placeholder>Deposit</Placeholder> },
            { label: "Payment schedule", value: <Placeholder>Payment Schedule</Placeholder> },
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Assumptions and Next Steps">
        <BulletList
          items={[
            <>Client feedback will be consolidated by one decision-maker.</>,
            <>Third-party licenses, hosting, fonts, and paid tools are billed separately unless included in the SOW.</>,
            <>Work begins after proposal approval, signed agreement, and initial payment.</>,
          ]}
        />
      </DocumentSection>
      <SignatureBlock parties={["Pyxis Studio approval", "Client approval"]} />
    </DocumentShell>
  );
}

function MsaDocument() {
  return (
    <DocumentShell
      title="Master Services Agreement"
    >
      <DocumentSection title="Parties">
        <p>
          This agreement is between <Placeholder>Pyxis Legal Entity</Placeholder>{" "}
          and <Placeholder>Client Legal Entity</Placeholder>. It governs
          services described in one or more statements of work.
        </p>
      </DocumentSection>
      <DocumentSection title="Services and Responsibilities">
        <BulletList
          items={[
            <>Pyxis will provide strategy, design, development, creative, and related delivery services described in each SOW.</>,
            <>Client will provide timely feedback, approvals, content, access, and materials needed to complete the work.</>,
            <>Each SOW controls project scope, timeline, deliverables, and pricing for that engagement.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Payment, Revisions, and Changes">
        <BulletList
          items={[
            <>Fees, deposits, milestones, and due dates are defined in the applicable SOW or invoice.</>,
            <>Unless stated otherwise, each phase includes up to two revision phases based on clear, consolidated feedback.</>,
            <>Out-of-scope requests, timeline changes, or additional deliverables require a written change order.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Ownership and Third-Party Materials">
        <p>
          After full payment, the client owns final deliverables created
          specifically for the project. Pyxis retains pre-existing methods,
          components, internal tools, know-how, and reusable
          intellectual property. Third-party materials remain subject to their
          own licenses.
        </p>
      </DocumentSection>
      <DocumentSection title="Confidentiality, Portfolio Use, and Termination">
        <BulletList
          items={[
            <>Both parties will protect confidential information shared during the project.</>,
            <>Pyxis may reference completed work in its portfolio unless restricted in writing.</>,
            <>Either party may terminate according to the notice and payment terms in the SOW.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Liability and Governing Law">
        <p>
          Liability limits, dispute handling, and governing law should be
          reviewed by counsel and completed before use:{" "}
          <Placeholder>Governing Law / Jurisdiction</Placeholder>.
        </p>
      </DocumentSection>
      <SignatureBlock />
    </DocumentShell>
  );
}

function SowDocument() {
  return (
    <DocumentShell
      title="Statement of Work"
    >
      <DocumentSection title="Project Summary">
        <FieldGrid
          fields={[
            { label: "Client", value: <Placeholder>Client Name</Placeholder> },
            { label: "Project", value: <Placeholder>Project Name</Placeholder> },
            { label: "Start date", value: <Placeholder>Start Date</Placeholder> },
            { label: "Target launch", value: <Placeholder>Launch Date</Placeholder> },
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Deliverables and Phases">
        <DocumentTable
          headers={["Phase", "Deliverables", "Acceptance"]}
          rows={[
            ["Discovery", "Goals, audience, sitemap, requirements.", "Client approves direction."],
            ["Design", "Figma concepts, responsive states, design system notes.", "Client approves final design."],
            ["Build", "Implementation, content entry, integrations, QA.", "Client approves staging review."],
            ["Launch", "Deployment, checks, handoff, documentation.", "Client signs launch acceptance."],
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Revision Allowance">
        <p>
          Each phase includes up to two revision phases. Feedback must be clear,
          specific, and consolidated by the client decision-maker.
        </p>
      </DocumentSection>
      <DocumentSection title="Fees and Out-of-Scope Items">
        <FieldGrid
          fields={[
            { label: "Total fee", value: <Placeholder>Total Fee</Placeholder> },
            { label: "Deposit", value: <Placeholder>Deposit</Placeholder> },
            { label: "Remaining balance", value: <Placeholder>Balance</Placeholder> },
            { label: "Out of scope", value: <Placeholder>Excluded Items</Placeholder> },
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Acceptance Criteria">
        <Checklist
          items={[
            <>Core pages or features match approved scope.</>,
            <>Responsive layouts are reviewed across agreed breakpoints.</>,
            <>Known launch-blocking issues are resolved or documented.</>,
            <>Client receives source files and implementation access.</>,
          ]}
        />
      </DocumentSection>
      <SignatureBlock />
    </DocumentShell>
  );
}

function InvoiceDocument() {
  return (
    <DocumentShell
      title="Invoice"
    >
      <FieldGrid
        fields={[
          { label: "Invoice number", value: <Placeholder>Invoice No.</Placeholder> },
          { label: "Issue date", value: <Placeholder>Issue Date</Placeholder> },
          { label: "Due date", value: <Placeholder>Due Date</Placeholder> },
          { label: "Currency", value: <Placeholder>Currency</Placeholder> },
        ]}
      />
      <DocumentSection title="Bill To / From">
        <DocumentTable
          headers={["From", "Bill to"]}
          rows={[
            [
              <span key="from">
                <Placeholder>Pyxis Legal Entity</Placeholder>
                <br />
                <Placeholder>Address</Placeholder>
                <br />
                <Placeholder>Tax ID</Placeholder>
              </span>,
              <span key="to">
                <Placeholder>Client Legal Entity</Placeholder>
                <br />
                <Placeholder>Client Address</Placeholder>
                <br />
                <Placeholder>Client Tax ID</Placeholder>
              </span>,
            ],
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Line Items">
        <DocumentTable
          headers={["Description", "Qty", "Rate", "Amount"]}
          rows={[
            [
              "Project deposit or milestone",
              "1",
              <Placeholder key="rate">Rate</Placeholder>,
              <Placeholder key="amount">Amount</Placeholder>,
            ],
            ["Tax or VAT", "", "", <Placeholder key="tax">Tax</Placeholder>],
            ["Total due", "", "", <Placeholder key="total">Total</Placeholder>],
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Payment Details">
        <p>
          Payment method: <Placeholder>Payment Method</Placeholder>. Payment
          details: <Placeholder>Bank / Payment Link</Placeholder>.
        </p>
      </DocumentSection>
      <LegalNote>
        Late fees, taxes, payment processor fees, and withholding requirements
        should be completed according to the final client agreement and local
        accounting advice.
      </LegalNote>
    </DocumentShell>
  );
}

function ChangeOrderDocument() {
  return (
    <DocumentShell
      title="Change Order"
    >
      <DocumentSection title="Requested Change">
        <FieldGrid
          fields={[
            { label: "Project", value: <Placeholder>Project Name</Placeholder> },
            { label: "Requested by", value: <Placeholder>Name</Placeholder> },
            { label: "Request date", value: <Placeholder>Date</Placeholder> },
            { label: "Priority", value: <Placeholder>Priority</Placeholder> },
          ]}
        />
        <p>
          Change summary: <Placeholder>Describe requested change</Placeholder>.
        </p>
      </DocumentSection>
      <DocumentSection title="Scope, Fee, and Timeline Impact">
        <DocumentTable
          headers={["Area", "Impact"]}
          rows={[
            ["Added scope", <Placeholder key="added">New deliverables</Placeholder>],
            ["Removed scope", <Placeholder key="removed">Removed deliverables</Placeholder>],
            ["Fee impact", <Placeholder key="fee">Additional Fee / Credit</Placeholder>],
            ["Timeline impact", <Placeholder key="timeline">Schedule Change</Placeholder>],
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Approval">
        <p>
          Work described in this change order will begin only after written
          approval and any required payment.
        </p>
      </DocumentSection>
      <SignatureBlock />
    </DocumentShell>
  );
}

function RevisionRequestDocument() {
  return (
    <DocumentShell
      title="Revision / Feedback Request"
    >
      <DocumentSection title="Request Details">
        <FieldGrid
          fields={[
            { label: "Project", value: <Placeholder>Project Name</Placeholder> },
            { label: "Phase", value: <Placeholder>Design / Build / Launch</Placeholder> },
            { label: "Submitted by", value: <Placeholder>Name</Placeholder> },
            { label: "Requested deadline", value: <Placeholder>Date</Placeholder> },
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Feedback Table">
        <DocumentTable
          headers={["Item", "Requested change", "Priority", "Reference"]}
          rows={[
            [
              <Placeholder key="item-1">Page / section</Placeholder>,
              <Placeholder key="change-1">Specific change</Placeholder>,
              <Placeholder key="priority-1">High / Medium / Low</Placeholder>,
              <Placeholder key="reference-1">Link / screenshot</Placeholder>,
            ],
            [
              <Placeholder key="item-2">Page / section</Placeholder>,
              <Placeholder key="change-2">Specific change</Placeholder>,
              <Placeholder key="priority-2">High / Medium / Low</Placeholder>,
              <Placeholder key="reference-2">Link / screenshot</Placeholder>,
            ],
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Guidelines">
        <BulletList
          items={[
            <>Group feedback into one clear list per phase.</>,
            <>Describe the desired result rather than only naming the issue.</>,
            <>Requests outside the approved scope may require a change order.</>,
          ]}
        />
      </DocumentSection>
      <SignatureBlock parties={["Client reviewer", "Pyxis project lead"]} />
    </DocumentShell>
  );
}

function AcceptanceDocument() {
  return (
    <DocumentShell
      title="Project Acceptance / Sign-Off"
    >
      <DocumentSection title="Accepted Deliverables">
        <Checklist
          items={[
            <>Final design files and assets delivered.</>,
            <>Website, app, or product build reviewed on staging or production.</>,
            <>Content, links, forms, and primary flows checked.</>,
            <>Known open items are listed below.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Known Open Items">
        <DocumentTable
          headers={["Item", "Owner", "Resolution date"]}
          rows={[
            [
              <Placeholder key="open-item-1">Open item</Placeholder>,
              <Placeholder key="owner-1">Owner</Placeholder>,
              <Placeholder key="date-1">Date</Placeholder>,
            ],
            [
              <Placeholder key="open-item-2">Open item</Placeholder>,
              <Placeholder key="owner-2">Owner</Placeholder>,
              <Placeholder key="date-2">Date</Placeholder>,
            ],
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Acceptance Statement">
        <p>
          Client confirms that the deliverables listed in this document are
          accepted for launch, handoff, or final project close. Maintenance
          starts on <Placeholder>Maintenance Start Date</Placeholder>.
        </p>
      </DocumentSection>
      <SignatureBlock />
    </DocumentShell>
  );
}

function HandoffDocument() {
  return (
    <DocumentShell
      title="Final Handoff Checklist"
    >
      <DocumentSection title="Files and Assets">
        <Checklist
          items={[
            <>Figma source files or view links.</>,
            <>PNG, SVG, logo, image, and brand assets.</>,
            <>Rive, Lottie, animation, and motion files where applicable.</>,
            <>Copy, content, and SEO metadata files where applicable.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Implementation Access">
        <Checklist
          items={[
            <>Repository access and branch notes.</>,
            <>Deployment access and environment notes.</>,
            <>CMS, analytics, hosting, and integration access.</>,
            <>Credential ownership transferred or documented securely.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Documentation and Confirmations">
        <DocumentTable
          headers={["Area", "Confirmation"]}
          rows={[
            ["Launch notes", <Placeholder key="launch">Link or status</Placeholder>],
            ["Maintenance window", <Placeholder key="maintenance">Dates</Placeholder>],
            ["Training call", <Placeholder key="training">Date / recording</Placeholder>],
            ["Final invoice", <Placeholder key="invoice">Status</Placeholder>],
          ]}
        />
      </DocumentSection>
      <SignatureBlock parties={["Pyxis handoff owner", "Client receiver"]} />
    </DocumentShell>
  );
}

function RetainerAgreementDocument() {
  return (
    <DocumentShell
      title="Retainer Agreement"
    >
      <DocumentSection title="Retainer Summary">
        <FieldGrid
          fields={[
            { label: "Client", value: <Placeholder>Client Name</Placeholder> },
            { label: "Monthly fee", value: <Placeholder>Monthly Fee</Placeholder> },
            { label: "Start date", value: <Placeholder>Start Date</Placeholder> },
            { label: "Billing cycle", value: <Placeholder>Billing Cycle</Placeholder> },
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Working Model">
        <BulletList
          items={[
            <>Pyxis works on one active request at a time unless otherwise agreed.</>,
            <>Scope can evolve across design, development, content, QA, and improvements.</>,
            <>Daily updates are provided Monday through Friday on active workdays.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Exclusions and Pause / Cancel Terms">
        <BulletList
          items={[
            <>Major new products, emergency support, paid third-party costs, and legal/accounting work are excluded unless added in writing.</>,
            <>Unused time does not roll over unless specifically agreed.</>,
            <>Either party may pause or cancel with <Placeholder>Notice Period</Placeholder> written notice.</>,
          ]}
        />
      </DocumentSection>
      <SignatureBlock />
    </DocumentShell>
  );
}

function RetainerRenewalDocument() {
  return (
    <DocumentShell
      title="Retainer Renewal / Continuation"
    >
      <DocumentSection title="Renewal Terms">
        <FieldGrid
          fields={[
            { label: "Current retainer", value: <Placeholder>Agreement Name</Placeholder> },
            { label: "Renewed term", value: <Placeholder>Start Date to End Date</Placeholder> },
            { label: "Monthly fee", value: <Placeholder>Monthly Fee</Placeholder> },
            { label: "Scope changes", value: <Placeholder>Changes or No Changes</Placeholder> },
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Continuing Scope">
        <p>
          The parties agree to continue the retainer under the same core terms
          unless changes are listed here: <Placeholder>Scope Changes</Placeholder>.
        </p>
      </DocumentSection>
      <DocumentSection title="Approval">
        <p>
          Renewal starts after approval and payment of the next billing period.
        </p>
      </DocumentSection>
      <SignatureBlock />
    </DocumentShell>
  );
}

function ReleaseDocument() {
  return (
    <DocumentShell
      title="Logo, Testimonial, and Portfolio Use Release"
    >
      <DocumentSection title="Permission Scope">
        <p>
          Client grants Pyxis permission to reference the project, client name,
          logo, approved screenshots, and approved testimonial text for
          portfolio and marketing use.
        </p>
      </DocumentSection>
      <DocumentSection title="Approved Channels">
        <Checklist
          items={[
            <>Pyxis website and work archive.</>,
            <>Social media and founder accounts.</>,
            <>Sales decks, proposals, and case studies.</>,
            <>Award submissions or public design showcases.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Attribution and Restrictions">
        <FieldGrid
          fields={[
            { label: "Approved name", value: <Placeholder>Client / Brand Name</Placeholder> },
            { label: "Approved testimonial", value: <Placeholder>Quote</Placeholder> },
            { label: "Restrictions", value: <Placeholder>Embargo / exclusions</Placeholder> },
            { label: "Review required", value: <Placeholder>Yes / No</Placeholder> },
          ]}
        />
      </DocumentSection>
      <LegalNote>
        Revocation or changes should be requested in writing. Previously
        published materials may need reasonable time to update or remove.
      </LegalNote>
      <SignatureBlock />
    </DocumentShell>
  );
}

function MaintenanceDocument() {
  return (
    <DocumentShell
      title="30-Day Maintenance Agreement"
    >
      <DocumentSection title="Coverage Window">
        <FieldGrid
          fields={[
            { label: "Project", value: <Placeholder>Project Name</Placeholder> },
            { label: "Start date", value: <Placeholder>Start Date</Placeholder> },
            { label: "End date", value: <Placeholder>End Date</Placeholder> },
            { label: "Contact channel", value: <Placeholder>Channel</Placeholder> },
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Included Support">
        <BulletList
          items={[
            <>Bug fixes for approved launch scope.</>,
            <>Small content, link, or configuration corrections.</>,
            <>Performance, form, and responsive checks related to launch.</>,
            <>Guidance for using delivered files, tools, or admin panels.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Excluded Support">
        <BulletList
          items={[
            <>New pages, new features, new integrations, or redesign work.</>,
            <>Issues caused by third-party service outages or client-side changes.</>,
            <>Emergency support outside agreed response expectations.</>,
          ]}
        />
      </DocumentSection>
      <DocumentSection title="Retainer Option">
        <p>
          At the end of the maintenance window, ongoing improvements can move
          into a monthly support or design/development retainer.
        </p>
      </DocumentSection>
      <SignatureBlock parties={["Pyxis support owner", "Client contact"]} />
    </DocumentShell>
  );
}

export const pyxisDocuments: PyxisDocument[] = [
  {
    slug: "proposal",
    title: "Client Proposal",
    type: "Sales",
    description: "A polished proposal for first project approval.",
    Component: ProposalDocument,
  },
  {
    slug: "msa",
    title: "Master Services Agreement",
    type: "Legal",
    description: "Reusable base agreement for client engagements.",
    Component: MsaDocument,
  },
  {
    slug: "statement-of-work",
    title: "Statement of Work",
    type: "Project",
    description: "Defines project scope, phases, fees, and acceptance.",
    Component: SowDocument,
  },
  {
    slug: "invoice",
    title: "Invoice",
    type: "Finance",
    description: "Client invoice with line items and payment details.",
    Component: InvoiceDocument,
  },
  {
    slug: "change-order",
    title: "Change Order",
    type: "Project",
    description: "Approves scope, timeline, or fee changes.",
    Component: ChangeOrderDocument,
  },
  {
    slug: "revision-request",
    title: "Revision Request",
    type: "Feedback",
    description: "Keeps feedback clear, specific, and consolidated.",
    Component: RevisionRequestDocument,
  },
  {
    slug: "acceptance",
    title: "Project Acceptance",
    type: "Closeout",
    description: "Final approval and launch or handoff sign-off.",
    Component: AcceptanceDocument,
  },
  {
    slug: "handoff",
    title: "Final Handoff Checklist",
    type: "Closeout",
    description: "Tracks source files, access, assets, and documentation.",
    Component: HandoffDocument,
  },
  {
    slug: "retainer-agreement",
    title: "Retainer Agreement",
    type: "Retainer",
    description: "Monthly design and development retainer terms.",
    Component: RetainerAgreementDocument,
  },
  {
    slug: "retainer-renewal",
    title: "Retainer Renewal",
    type: "Retainer",
    description: "Continuation form for an active retainer.",
    Component: RetainerRenewalDocument,
  },
  {
    slug: "portfolio-release",
    title: "Portfolio Use Release",
    type: "Permission",
    description: "Permission for logos, testimonials, and case study use.",
    Component: ReleaseDocument,
  },
  {
    slug: "maintenance",
    title: "30-Day Maintenance",
    type: "Support",
    description: "Post-launch support coverage and exclusions.",
    Component: MaintenanceDocument,
  },
];
