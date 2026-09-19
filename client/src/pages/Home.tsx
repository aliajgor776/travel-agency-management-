import { useMemo, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  CircleHelp,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Filter,
  Globe2,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  MoreHorizontal,
  Plane,
  Plus,
  ReceiptText,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Ticket,
  TrendingUp,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: LucideIcon;
  badge?: string;
};

type Activity = {
  type: string;
  name: string;
  service: string;
  amount: string;
  status: string;
  statusTone: string;
  time: string;
  initials: string;
  avatar: string;
};

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Bookings", icon: Ticket, badge: "12" },
      { label: "Customers", icon: Users },
      { label: "Visa cases", icon: FileCheck2, badge: "7" },
    ],
  },
  {
    label: "Operations",
    items: [
      { label: "Ticketing", icon: Plane },
      { label: "Packages", icon: BriefcaseBusiness },
      { label: "Suppliers", icon: Building2 },
      { label: "Tasks & follow-ups", icon: Clock3, badge: "4" },
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Profit & loss", icon: TrendingUp },
      { label: "Receivables", icon: WalletCards },
      { label: "Expenses", icon: ReceiptText },
      { label: "Reports", icon: FileText },
    ],
  },
];

const activities: Activity[] = [
  { type: "New booking", name: "Nusrat Jahan", service: "Dubai family package", amount: "৳ 2,85,000", status: "Confirmed", statusTone: "success", time: "8 min ago", initials: "NJ", avatar: "avatar-sage" },
  { type: "Payment received", name: "Rahim Uddin", service: "Biman · DAC → DXB", amount: "৳ 74,500", status: "Paid", statusTone: "success", time: "24 min ago", initials: "RU", avatar: "avatar-lilac" },
  { type: "Visa update", name: "Maliha Karim", service: "UK Standard Visitor", amount: "৳ 18,000", status: "In review", statusTone: "warning", time: "1 hr ago", initials: "MK", avatar: "avatar-peach" },
  { type: "New enquiry", name: "Tanvir Ahmed", service: "Umrah · December 2026", amount: "৳ 1,32,000", status: "Follow-up", statusTone: "neutral", time: "2 hr ago", initials: "TA", avatar: "avatar-blue" },
];

const pipeline = [
  { label: "Enquiry", value: 126, amount: "৳ 38.4L", color: "#b7c4bf" },
  { label: "Quoted", value: 74, amount: "৳ 21.8L", color: "#8fc8ad" },
  { label: "Negotiation", value: 31, amount: "৳ 9.6L", color: "#f3c77b" },
  { label: "Won", value: 19, amount: "৳ 6.3L", color: "#1e9b72" },
];

const moduleRows: Record<string, { title: string; subtitle: string; status: string; value: string; tone: string }[]> = {
  Bookings: [
    { title: "TL-260918-034", subtitle: "Nusrat Jahan · Dubai family package", status: "Confirmed", value: "৳ 2,85,000", tone: "success" },
    { title: "TL-260918-031", subtitle: "Rahim Uddin · Biman DAC → DXB", status: "Ticketed", value: "৳ 74,500", tone: "success" },
    { title: "TL-260918-027", subtitle: "Maliha Karim · UK visitor visa", status: "In review", value: "৳ 18,000", tone: "warning" },
    { title: "TL-260917-019", subtitle: "Tanvir Ahmed · Umrah Dec 2026", status: "Follow-up", value: "৳ 1,32,000", tone: "neutral" },
  ],
  "Visa cases": [
    { title: "VS-2609-118", subtitle: "Maliha Karim · UK Standard Visitor", status: "In review", value: "17 days left", tone: "warning" },
    { title: "VS-2609-114", subtitle: "Nayeem Hasan · Schengen Tourist", status: "Docs pending", value: "5 docs", tone: "neutral" },
    { title: "VS-2609-107", subtitle: "Sanjida Rahman · UAE Visit", status: "Approved", value: "Ready to send", tone: "success" },
  ],
  Customers: [
    { title: "CUS-00482", subtitle: "Nusrat Jahan · 4 bookings · VIP", status: "Active", value: "৳ 5,48,000 LTV", tone: "success" },
    { title: "CUS-00477", subtitle: "Rahim Uddin · Frequent flyer", status: "Active", value: "৳ 2,10,500 LTV", tone: "success" },
    { title: "CUS-00461", subtitle: "Maliha Karim · Visa lead", status: "Needs follow-up", value: "Last seen 4d", tone: "warning" },
  ],
  Suppliers: [
    { title: "SUP-0018", subtitle: "Emirates Holidays · Dubai DMC", status: "Preferred", value: "৳ 8,42,000 payable", tone: "success" },
    { title: "SUP-0014", subtitle: "Biman Bangladesh Airlines", status: "Active", value: "৳ 3,18,500 payable", tone: "neutral" },
    { title: "SUP-0009", subtitle: "Gulf Air · Wholesale desk", status: "Pending invoice", value: "৳ 86,000 payable", tone: "warning" },
  ],
};

const formatBDT = (amount: number) =>
  new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(amount);

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}

function StatCard({ label, value, change, caption, icon: Icon, tone, negative = false }: { label: string; value: string; change: string; caption: string; icon: LucideIcon; tone: string; negative?: boolean }) {
  return (
    <div className="stat-card">
      <div className="stat-topline">
        <span className={`stat-icon ${tone}`}><Icon size={17} strokeWidth={2.1} /></span>
        <span className="stat-label">{label}</span>
        <button className="icon-button subtle" aria-label={`More options for ${label}`}><MoreHorizontal size={17} /></button>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-bottomline">
        <span className={`trend ${negative ? "down" : "up"}`}>{negative ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{change}</span>
        <span className="stat-caption">{caption}</span>
      </div>
    </div>
  );
}

function SalesChart() {
  const bars = [58, 71, 48, 78, 62, 88, 72, 95, 70, 84, 67, 81];
  return (
    <div className="chart-wrap">
      <div className="chart-ylabels"><span>৳ 10L</span><span>৳ 7.5L</span><span>৳ 5L</span><span>৳ 2.5L</span><span>৳ 0</span></div>
      <div className="chart-area">
        <div className="chart-grid"><span /><span /><span /><span /><span /></div>
        <svg className="line-svg" viewBox="0 0 780 240" preserveAspectRatio="none" aria-label="Monthly sales trend chart">
          <defs><linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#36ac82" stopOpacity=".22" /><stop offset="100%" stopColor="#36ac82" stopOpacity="0" /></linearGradient></defs>
          <path d="M0 188 C45 174 70 160 100 168 S155 144 188 152 S235 120 268 138 S322 108 348 124 S410 90 443 112 S498 84 530 98 S574 55 612 84 S672 48 705 63 S748 32 780 38 L780 240 L0 240 Z" fill="url(#salesFill)" />
          <path d="M0 188 C45 174 70 160 100 168 S155 144 188 152 S235 120 268 138 S322 108 348 124 S410 90 443 112 S498 84 530 98 S574 55 612 84 S672 48 705 63 S748 32 780 38" fill="none" stroke="#1e9b72" strokeWidth="3" strokeLinecap="round" />
          <circle cx="780" cy="38" r="5" fill="#fff" stroke="#1e9b72" strokeWidth="3" />
        </svg>
        <div className="bar-row">{bars.map((bar, index) => <div className="chart-bar-wrap" key={index}><div className="chart-bar" style={{ height: `${bar}%` }} /></div>)}</div>
        <div className="chart-xlabels"><span>Oct 25</span><span>Nov 25</span><span>Dec 25</span><span>Jan 26</span><span>Feb 26</span><span>Mar 26</span><span>Apr 26</span><span>May 26</span><span>Jun 26</span><span>Jul 26</span><span>Aug 26</span><span>Sep 26</span></div>
      </div>
    </div>
  );
}

function Sidebar({ activeItem, onSelect, onClose }: { activeItem: string; onSelect: (item: string) => void; onClose?: () => void }) {
  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-mark"><Plane size={19} fill="currentColor" /></div>
        <div><div className="brand-name">trip<span>ledger</span></div><div className="brand-sub">BD edition</div></div>
        {onClose && <button className="mobile-close" onClick={onClose} aria-label="Close navigation"><X size={18} /></button>}
      </div>
      <div className="workspace-switcher"><div className="workspace-logo">A</div><div className="workspace-copy"><strong>Alif Travels</strong><span>Dhaka · Admin workspace</span></div><ChevronDown size={15} /></div>
      <div className="nav-scroll">
        {navGroups.map((group) => <div className="nav-group" key={group.label}><div className="nav-group-label">{group.label}</div>{group.items.map(({ label, icon: Icon, badge }) => <button className={`nav-item ${activeItem === label ? "active" : ""}`} key={label} onClick={() => { onSelect(label); onClose?.(); }}><Icon size={17} strokeWidth={activeItem === label ? 2.4 : 1.9} /><span>{label}</span>{badge && <span className="nav-badge">{badge}</span>}</button>)}</div>)}
      </div>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><div><strong>Need a hand?</strong><span>Visit help center</span></div><ArrowUpRight size={14} /></div><button className={`nav-item ${activeItem === "Settings" ? "active" : ""}`} onClick={() => { onSelect("Settings"); onClose?.(); }}><Settings size={17} /><span>Team access</span></button><button className="profile-row"><div className="profile-avatar">SA</div><div className="profile-copy"><strong>Sarah Ahmed</strong><span>Super admin</span></div><MoreHorizontal size={17} /></button></div>
    </aside>
  );
}

function NewBookingModal({ onClose }: { onClose: () => void }) {
  const { isAuthenticated } = useAuth();
  const [bookingType, setBookingType] = useState("Flight ticket");
  const [saving, setSaving] = useState(false);
  const createCustomer = trpc.customers.create.useMutation();
  const createBooking = trpc.bookings.create.useMutation();
  const saveBooking = async (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaving(true); const form = new FormData(event.currentTarget); const customerName = String(form.get("customerName") ?? "").trim(); try { if (!isAuthenticated) { onClose(); toast.info("Sign in to save live bookings", { description: "The demo drawer is ready; sign in to persist records to your team database." }); return; } const customer = await createCustomer.mutateAsync({ name: customerName, phone: String(form.get("phone") ?? ""), status: "active", notes: "Created from quick booking flow" }); if (!customer) throw new Error("Customer could not be created"); const booking = await createBooking.mutateAsync({ customerId: customer.id, bookingNo: `TL-${Date.now()}`, serviceType: bookingType, travelDate: new Date(String(form.get("travelDate") ?? Date.now())), quoteAmount: Number(form.get("quoteAmount") ?? 0), costAmount: 0, paidAmount: 0, notes: String(form.get("notes") ?? "") }); onClose(); toast.success("Booking saved", { description: `${booking?.bookingNo ?? "New booking"} is ready for your team.` }); } catch (error) { toast.error("Could not save booking", { description: error instanceof Error ? error.message : "Please check the fields and try again." }); } finally { setSaving(false); } };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="modal-panel" onSubmit={saveBooking}>
    <div className="modal-header"><div><div className="eyebrow">Quick create</div><h2>New booking</h2><p>Start a new customer itinerary in under a minute.</p></div><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
    <div className="modal-body"><label>Customer name<input name="customerName" required placeholder="e.g. Nusrat Jahan" /></label><label>Service type<select value={bookingType} onChange={(event) => setBookingType(event.target.value)}><option>Flight ticket</option><option>Visa processing</option><option>Tour package</option><option>Hotel & transfer</option><option>Umrah package</option></select></label><div className="field-grid"><label>Travel date<input name="travelDate" type="date" defaultValue="2026-10-18" /></label><label>Sales owner<select defaultValue="Sarah Ahmed"><option>Sarah Ahmed</option><option>Imran Hossain</option><option>Rafiul Karim</option></select></label></div><div className="field-grid"><label>Quoted amount<input name="quoteAmount" type="number" defaultValue="0" /></label><label>Customer phone<input name="phone" placeholder="01XXXXXXXXX" /></label></div><label>Internal note<textarea name="notes" placeholder="Add a note for the operations team..." rows={3} /></label></div>
    <div className="modal-footer"><button type="button" className="text-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving..." : "Save booking"}<ArrowUpRight size={15} /></button></div>
  </form></div>;
}

type RecordKind = "Customers" | "Bookings" | "Visa cases" | "Invoices" | "Tasks & follow-ups";
type RecordData = Record<string, unknown> & { id?: number };

function RecordEditor({ kind, record, onClose }: { kind: RecordKind; record?: RecordData; onClose: () => void }) {
  const customerUpdate = trpc.customers.update.useMutation();
  const customerCreate = trpc.customers.create.useMutation();
  const bookingUpdate = trpc.bookings.update.useMutation();
  const visaCreate = trpc.visas.create.useMutation();
  const visaUpdate = trpc.visas.update.useMutation();
  const invoiceCreate = trpc.invoices.create.useMutation();
  const followUpQueue = trpc.followUps.queue.useMutation();
  const documentUpload = trpc.documents.upload.useMutation();
  const [saving, setSaving] = useState(false);
  const title = record?.id ? `Edit ${kind}` : `New ${kind}`;
  const isCustomer = kind === "Customers";
  const isBooking = kind === "Bookings";
  const isVisa = kind === "Visa cases";
  const isInvoice = kind === "Invoices";
  const isFollowUp = kind === "Tasks & follow-ups";
  const defaultStatus = String(record?.status ?? (isCustomer ? "active" : isBooking ? "quoted" : isVisa ? "documents_pending" : isInvoice ? "draft" : "queued"));
  const readFileAsBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      const value = (name: string) => String(form.get(name) ?? "").trim();
      if (isCustomer) {
        const input = { name: value("name"), phone: value("phone"), email: value("email"), passportNo: value("passportNo"), status: value("status") as "active" | "inactive" | "vip", notes: value("notes") };
        if (record?.id) await customerUpdate.mutateAsync({ id: record.id, ...input }); else await customerCreate.mutateAsync(input);
      } else if (isBooking && record?.id) {
        await bookingUpdate.mutateAsync({ id: record.id, status: value("status") as "enquiry" | "quoted" | "negotiation" | "confirmed" | "ticketed" | "completed" | "cancelled", quoteAmount: Number(value("quoteAmount") || 0), paidAmount: Number(value("paidAmount") || 0), notes: value("notes") });
      } else if (isVisa) {
        if (record?.id) {
          await visaUpdate.mutateAsync({ id: record.id, status: value("status") as "lead" | "documents_pending" | "in_review" | "submitted" | "approved" | "rejected" | "completed", serviceFee: Number(value("serviceFee") || 0), notes: value("notes") });
        } else {
          await visaCreate.mutateAsync({ customerId: Number(value("customerId") || 0), applicationNo: value("applicationNo") || `VS-${Date.now()}`, country: value("country"), visaType: value("visaType"), status: value("status") as "lead" | "documents_pending" | "in_review" | "submitted" | "approved" | "rejected" | "completed", serviceFee: Number(value("serviceFee") || 0), notes: value("notes") });
        }
        const file = form.get("file");
        if (record?.id && file instanceof File && file.size > 0) {
          await documentUpload.mutateAsync({ visaCaseId: record.id, fileName: file.name, mimeType: file.type || "application/octet-stream", sizeBytes: file.size, base64: await readFileAsBase64(file) });
        }
      } else if (isInvoice) {
        await invoiceCreate.mutateAsync({ customerId: Number(value("customerId") || 0), invoiceNo: value("invoiceNo") || `INV-${Date.now()}`, status: value("status") as "draft" | "sent" | "partially_paid" | "paid" | "overdue" | "void", subtotal: Number(value("subtotal") || 0), tax: Number(value("tax") || 0), total: Number(value("total") || 0), dueAmount: Number(value("dueAmount") || 0), notes: value("notes") });
      } else if (isFollowUp) {
        await followUpQueue.mutateAsync({ channel: value("channel") as "whatsapp" | "sms" | "email" | "call" | "internal", dueAt: new Date(value("dueAt") || Date.now()), message: value("message") });
      }
      toast.success(`${kind} saved`, { description: "The record is now part of your workspace." });
      onClose();
    } catch (error) {
      toast.error("Could not save record", { description: error instanceof Error ? error.message : "Please check the fields and try again." });
    } finally {
      setSaving(false);
    }
  };
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><form className="modal-panel" onSubmit={save}>
    <div className="modal-header"><div><div className="eyebrow">Workspace record</div><h2>{title}</h2><p>Changes are saved to your team workspace when database access is connected.</p></div><button type="button" className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button></div>
    <div className="modal-body">
      {isCustomer && <><label>Customer name<input name="name" required defaultValue={String(record?.name ?? "")} placeholder="e.g. Nusrat Jahan" /></label><div className="field-grid"><label>Phone<input name="phone" defaultValue={String(record?.phone ?? "")} placeholder="01XXXXXXXXX" /></label><label>Email<input name="email" type="email" defaultValue={String(record?.email ?? "")} placeholder="customer@email.com" /></label></div><div className="field-grid"><label>Passport no.<input name="passportNo" defaultValue={String(record?.passportNo ?? "")} placeholder="E12345678" /></label><label>Status<select name="status" defaultValue={defaultStatus}><option value="active">Active</option><option value="vip">VIP</option><option value="inactive">Inactive</option></select></label></div><label>Notes<textarea name="notes" defaultValue={String(record?.notes ?? "")} rows={3} placeholder="Preferences, family group, important notes..." /></label></>}
      {isBooking && <><label>Status<select name="status" defaultValue={defaultStatus}><option value="enquiry">Enquiry</option><option value="quoted">Quoted</option><option value="negotiation">Negotiation</option><option value="confirmed">Confirmed</option><option value="ticketed">Ticketed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select></label><div className="field-grid"><label>Quoted amount<input name="quoteAmount" type="number" defaultValue={String(record?.quoteAmount ?? 0)} /></label><label>Paid amount<input name="paidAmount" type="number" defaultValue={String(record?.paidAmount ?? 0)} /></label></div><label>Internal note<textarea name="notes" defaultValue={String(record?.notes ?? "")} rows={3} placeholder="Add an operations note..." /></label></>}
      {isVisa && <><div className="field-grid"><label>Customer ID<input name="customerId" type="number" required={!record?.id} disabled={Boolean(record?.id)} defaultValue={String(record?.customerId ?? "")} placeholder="e.g. 42" /></label><label>Application no.<input name="applicationNo" required={!record?.id} disabled={Boolean(record?.id)} defaultValue={String(record?.applicationNo ?? "")} placeholder="VS-2609-001" /></label></div><div className="field-grid"><label>Country<input name="country" required={!record?.id} disabled={Boolean(record?.id)} defaultValue={String(record?.country ?? "")} placeholder="United Kingdom" /></label><label>Visa type<input name="visaType" required={!record?.id} disabled={Boolean(record?.id)} defaultValue={String(record?.visaType ?? "")} placeholder="Standard Visitor" /></label></div><label>Status<select name="status" defaultValue={defaultStatus}><option value="lead">Lead</option><option value="documents_pending">Documents pending</option><option value="in_review">In review</option><option value="submitted">Submitted</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="completed">Completed</option></select></label><label>Service fee<input name="serviceFee" type="number" min="0" defaultValue={String(record?.serviceFee ?? 0)} /></label><label>Upload document<input name="file" type="file" accept=".pdf,.jpg,.jpeg,.png" disabled={!record?.id} /><small className="field-hint">PDF, JPG or PNG · maximum 10MB{!record?.id ? " · save the case first, then attach documents" : ""}</small></label><label>Case note<textarea name="notes" defaultValue={String(record?.notes ?? "")} rows={3} placeholder="Document checklist, embassy notes..." /></label></>}
      {isInvoice && <><div className="field-grid"><label>Customer ID<input name="customerId" type="number" required placeholder="e.g. 42" /><small className="field-hint">Link this invoice to a customer record.</small></label><label>Invoice no.<input name="invoiceNo" placeholder="INV-260918-001" /></label></div><label>Status<select name="status" defaultValue={defaultStatus}><option value="draft">Draft</option><option value="sent">Sent</option><option value="partially_paid">Partially paid</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="void">Void</option></select></label><div className="field-grid"><label>Subtotal<input name="subtotal" type="number" defaultValue="0" /></label><label>Tax<input name="tax" type="number" defaultValue="0" /></label></div><div className="field-grid"><label>Total<input name="total" type="number" defaultValue="0" /></label><label>Due amount<input name="dueAmount" type="number" defaultValue="0" /></label></div><label>Notes<textarea name="notes" rows={3} placeholder="Payment terms, bank details..." /></label></>}
      {isFollowUp && <><label>Channel<select name="channel" defaultValue="whatsapp"><option value="whatsapp">WhatsApp</option><option value="sms">SMS</option><option value="email">Email</option><option value="call">Call</option><option value="internal">Internal task</option></select></label><label>Due at<input name="dueAt" type="datetime-local" defaultValue="2026-09-18T14:00" /></label><label>Message<textarea name="message" required rows={5} defaultValue="Assalamu alaikum, this is a friendly reminder from Alif Travels." /></label><div className="integration-note"><ShieldCheck size={16} /><span>Queued safely for the team. Actual WhatsApp sending activates when a WhatsApp Business provider is connected.</span></div></>}
    </div>
    <div className="modal-footer"><button type="button" className="text-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving..." : "Save changes"}<ArrowUpRight size={15} /></button></div>
  </form></div>;
}

function TeamAccessView() {
  const { isAuthenticated } = useAuth();
  const membersQuery = trpc.workspace.teamMembers.useQuery(undefined, { enabled: isAuthenticated });
  const updateRole = trpc.workspace.updateMemberRole.useMutation({ onSuccess: () => { toast.success("Permission updated"); void membersQuery.refetch(); } });
  const demoMembers = [{ id: 1, name: "Sarah Ahmed", email: "sarah@aliftravels.com", role: "admin" }, { id: 2, name: "Imran Hossain", email: "imran@aliftravels.com", role: "agent" }, { id: 3, name: "Rafiul Karim", email: "rafiul@aliftravels.com", role: "finance" }];
  const members = membersQuery.data?.map(({ member, user }) => ({ id: user.id, name: user.name ?? "Unnamed user", email: user.email ?? "No email", role: member.role })) ?? demoMembers;
  return <div className="module-page"><div className="module-hero"><div><div className="eyebrow">Workspace controls</div><h2>Team access</h2><p>Keep sales, finance and operations responsibilities separated without losing the full picture.</p></div><button className="primary-button" onClick={() => toast.info("Invite flow", { description: "Connect your team directory to invite a new member." })}><Plus size={15} />Invite member</button></div><div className="module-stats"><div><span>Team members</span><strong>{members.length}</strong><small>{isAuthenticated ? "Live workspace members" : "Demo members shown"}</small></div><div><span>Role groups</span><strong>4</strong><small>Admin · agent · finance · ops</small></div><div><span>Access policy</span><strong>Scoped</strong><small>Owner-controlled permissions</small></div></div><div className="module-table"><div className="table-toolbar"><div><div className="toolbar-title">Members & permissions</div><div className="toolbar-subtitle">Admins can change access levels. Owners keep workspace control.</div></div><ShieldCheck size={19} color="#238660" /></div>{members.map((member) => <div className="module-row" key={member.id}><div className="person-avatar avatar-sage">{member.name.split(" ").map(part => part[0]).join("").slice(0, 2)}</div><div className="row-leading"><div className="row-code">{member.name}</div><div className="row-subtitle">{member.email}</div></div><select className="module-filter-select" value={member.role} disabled={!isAuthenticated || member.role === "owner"} onChange={(event) => updateRole.mutate({ userId: member.id, role: event.target.value as "admin" | "agent" | "finance" | "operations" })}><option value="owner">Owner</option><option value="admin">Admin</option><option value="agent">Sales agent</option><option value="finance">Finance</option><option value="operations">Operations</option></select><Badge tone={member.role === "admin" || member.role === "owner" ? "success" : "neutral"}>{member.role}</Badge></div>)}</div></div>;
}

function ModuleView({ activeItem, onAddBooking }: { activeItem: string; onAddBooking: () => void }) {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editor, setEditor] = useState<{ kind: RecordKind; record?: RecordData } | null>(null);
  const customersQuery = trpc.customers.list.useQuery({ query }, { enabled: isAuthenticated && activeItem === "Customers" });
  const bookingsQuery = trpc.bookings.list.useQuery({ query, status: status === "all" ? undefined : status }, { enabled: isAuthenticated && activeItem === "Bookings" });
  const visaQuery = trpc.visas.list.useQuery({ query, status: status === "all" ? undefined : status }, { enabled: isAuthenticated && activeItem === "Visa cases" });
  const invoicesQuery = trpc.invoices.list.useQuery({ status: status === "all" ? undefined : status }, { enabled: isAuthenticated && activeItem === "Receivables" });
  const followUpsQuery = trpc.followUps.list.useQuery({ status: status === "all" ? undefined : status }, { enabled: isAuthenticated && activeItem === "Tasks & follow-ups" });
  const titleMap: Record<string, string> = { "Profit & loss": "Profit & loss", "Receivables": "Receivables & invoices", Expenses: "Expenses", Reports: "Reports", Ticketing: "Ticketing desk", Packages: "Packages", "Tasks & follow-ups": "Tasks & follow-ups" };
  const descriptionMap: Record<string, string> = { "Profit & loss": "See what is actually making money across flights, visas and packages.", Receivables: "Keep outstanding customer balances, invoice status and due dates in one clear view.", Expenses: "Track operational costs before they quietly eat into your margin.", Reports: "Export ready-to-share reports for owners and branch managers.", Ticketing: "Manage issued tickets, refunds, reissues and airline queues.", Packages: "Build sellable itineraries with costing and markup visibility.", "Tasks & follow-ups": "Never miss a callback, document request, payment reminder or WhatsApp queue." };
  const fallback = moduleRows[activeItem] ?? moduleRows.Bookings;
  const toneFor = (value: string) => value.toLowerCase().includes("paid") || value.toLowerCase().includes("approved") || value.toLowerCase().includes("confirmed") || value.toLowerCase().includes("active") ? "success" : value.toLowerCase().includes("pending") || value.toLowerCase().includes("review") || value.toLowerCase().includes("overdue") ? "warning" : "neutral";
  const dataRows: { title: string; subtitle: string; status: string; value: string; tone: string; record?: RecordData }[] = activeItem === "Customers" && customersQuery.data ? customersQuery.data.map((row) => ({ title: `CUS-${String(row.id).padStart(5, "0")}`, subtitle: `${row.name} · ${row.phone ?? "No phone"}${row.email ? ` · ${row.email}` : ""}`, status: row.status, value: row.passportNo ? `Passport ${row.passportNo}` : "Profile incomplete", tone: toneFor(row.status), record: row })) : activeItem === "Bookings" && bookingsQuery.data ? bookingsQuery.data.map(({ booking, customer }) => ({ title: booking.bookingNo, subtitle: `${customer?.name ?? "Unassigned customer"} · ${booking.serviceType}${booking.destination ? ` · ${booking.destination}` : ""}`, status: booking.status, value: formatBDT(booking.quoteAmount), tone: toneFor(booking.status), record: booking })) : activeItem === "Visa cases" && visaQuery.data ? visaQuery.data.map(({ visaCase, customer }) => ({ title: visaCase.applicationNo, subtitle: `${customer?.name ?? "Unassigned customer"} · ${visaCase.country} ${visaCase.visaType}`, status: visaCase.status.replaceAll("_", " "), value: formatBDT(visaCase.serviceFee), tone: toneFor(visaCase.status), record: visaCase })) : activeItem === "Receivables" && invoicesQuery.data ? invoicesQuery.data.map(({ invoice, customer }) => ({ title: invoice.invoiceNo, subtitle: `${customer?.name ?? "Unassigned customer"} · Due ${formatBDT(invoice.dueAmount)}`, status: invoice.status.replaceAll("_", " "), value: formatBDT(invoice.total), tone: toneFor(invoice.status), record: invoice })) : activeItem === "Tasks & follow-ups" && followUpsQuery.data ? followUpsQuery.data.map(({ followUp, customer }) => ({ title: `TASK-${String(followUp.id).padStart(4, "0")}`, subtitle: `${customer?.name ?? "Team follow-up"} · ${followUp.channel}`, status: followUp.status, value: new Date(followUp.dueAt).toLocaleDateString("en-BD", { day: "2-digit", month: "short" }), tone: toneFor(followUp.status), record: followUp })) : fallback.map((row) => ({ ...row, record: undefined }));
  const kindFor = (item: string): RecordKind => item === "Receivables" ? "Invoices" : item === "Tasks & follow-ups" ? "Tasks & follow-ups" : item === "Visa cases" ? "Visa cases" : item === "Customers" ? "Customers" : "Bookings";
  const canEdit = ["Customers", "Bookings", "Visa cases", "Receivables", "Tasks & follow-ups"].includes(activeItem);
  const openEditor = (record?: RecordData) => canEdit ? setEditor({ kind: kindFor(activeItem), record }) : toast.info("Report view", { description: "Use Export to share this workspace with your owner or branch manager." });
  return <div className="module-page"><div className="module-hero"><div><div className="eyebrow">Operations module</div><h2>{titleMap[activeItem] ?? activeItem}</h2><p>{descriptionMap[activeItem] ?? "A focused workspace designed for your team's daily flow."}</p></div><div className="module-actions"><button className="secondary-button" onClick={() => toast.success("Export prepared", { description: "Your filtered report is ready to download." })}><Download size={15} />Export</button><button className="primary-button" onClick={() => activeItem === "Bookings" ? onAddBooking() : openEditor()}><Plus size={15} />New entry</button></div></div><div className="module-stats"><div><span>Total records</span><strong>{dataRows.length || "0"}</strong><small>{isAuthenticated ? "Live workspace records" : "Demo records shown"}</small></div><div><span>Open today</span><strong>{dataRows.filter(row => !["paid", "completed", "done"].includes(row.status)).length || "0"}</strong><small>{activeItem === "Visa cases" ? "Cases needing action" : "Need attention"}</small></div><div><span>Value tracked</span><strong>{activeItem === "Customers" ? "৳ 8.6L" : activeItem === "Visa cases" ? "৳ 1.9L" : "৳ 18.6L"}</strong><small>Across this workspace</small></div></div><div className="module-table"><div className="table-toolbar"><div><div className="toolbar-title">{activeItem === "Customers" ? "Customer directory" : `Recent ${activeItem.toLowerCase()}`}</div><div className="toolbar-subtitle">{isAuthenticated ? "Connected to your team database" : "Client demo data · sign in to load live records"}</div></div><div className="module-filters"><label className="module-search"><Search size={14} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records..." /></label>{["Bookings", "Visa cases", "Receivables", "Tasks & follow-ups"].includes(activeItem) && <select className="module-filter-select" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option>{activeItem === "Bookings" && <><option value="enquiry">Enquiry</option><option value="quoted">Quoted</option><option value="confirmed">Confirmed</option><option value="ticketed">Ticketed</option><option value="completed">Completed</option></>}{activeItem === "Visa cases" && <><option value="documents_pending">Documents pending</option><option value="in_review">In review</option><option value="submitted">Submitted</option><option value="approved">Approved</option></>}{activeItem === "Receivables" && <><option value="draft">Draft</option><option value="sent">Sent</option><option value="partially_paid">Partially paid</option><option value="paid">Paid</option><option value="overdue">Overdue</option></>}{activeItem === "Tasks & follow-ups" && <><option value="queued">Queued</option><option value="sent">Sent</option><option value="done">Done</option></>}</select>}<button className="filter-button" onClick={() => { setQuery(""); setStatus("all"); }}><Filter size={15} /> Clear</button></div></div>{dataRows.length ? dataRows.map((row) => <div className="module-row" key={row.title}><div className="row-leading"><div className="row-code">{row.title}</div><div className="row-subtitle">{row.subtitle}</div></div><Badge tone={row.tone}>{row.status}</Badge><div className="row-value">{row.value}</div><button className="row-open" aria-label={`Edit ${row.title}`} onClick={() => openEditor(row.record)}><ArrowUpRight size={16} /></button></div>) : <div className="module-empty"><Search size={18} /><span>No records found. Create the first entry for this workspace.</span><button className="primary-button" onClick={() => openEditor()}>Create record</button></div>}</div>{editor && <RecordEditor kind={editor.kind} record={editor.record} onClose={() => { setEditor(null); void customersQuery.refetch(); void bookingsQuery.refetch(); void visaQuery.refetch(); void invoicesQuery.refetch(); void followUpsQuery.refetch(); }} />}</div>;
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const dashboardQuery = trpc.dashboard.summary.useQuery(undefined, { enabled: isAuthenticated });
  const summary = dashboardQuery.data;
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showBooking, setShowBooking] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("This month");
  const filteredActivities = useMemo(() => activities.filter((activity) => `${activity.name} ${activity.service}`.toLowerCase().includes(search.toLowerCase())), [search]);
  const firstName = user?.name?.split(" ")[0] ?? "Sarah";
  const initials = user?.name?.split(" ").map((part: string) => part[0]).join("").slice(0, 2).toUpperCase() ?? "SA";

  const selectNav = (item: string) => { setActiveItem(item); };

  return <div className="app-shell">
    <div className={`mobile-nav-overlay ${showMobileNav ? "visible" : ""}`} onClick={() => setShowMobileNav(false)} />
    <div className={`sidebar-drawer ${showMobileNav ? "open" : ""}`}><Sidebar activeItem={activeItem} onSelect={selectNav} onClose={() => setShowMobileNav(false)} /></div>
    <div className="desktop-sidebar"><Sidebar activeItem={activeItem} onSelect={selectNav} /></div>
    <main className="main-content">
      <header className="topbar"><div className="topbar-left"><button className="mobile-menu" onClick={() => setShowMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-separator">/</span><strong>{activeItem}</strong></div></div><div className="topbar-actions"><div className="global-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bookings, customers..." /><kbd>⌘ K</kbd></div><button className="top-icon" aria-label="Help" onClick={() => toast.info("Help center", { description: "Your onboarding checklist is 82% complete." })}><CircleHelp size={18} /></button><div className="notification-wrap"><button className="top-icon notification-button" aria-label="Notifications" onClick={() => setShowNotifications(!showNotifications)}><Bell size={18} /><span /></button>{showNotifications && <div className="notification-popover"><div className="popover-head"><strong>Notifications</strong><span>3 new</span></div><div className="notification-item"><div className="notification-dot green" /><div><strong>Payment received</strong><p>Rahim Uddin paid ৳ 74,500</p><small>24 min ago</small></div></div><div className="notification-item"><div className="notification-dot amber" /><div><strong>Visa document due</strong><p>Nayeem Hasan · passport copy</p><small>1 hr ago</small></div></div><button className="popover-link" onClick={() => toast.success("All notifications marked as read")}>Mark all as read</button></div>}</div>{isAuthenticated ? <div className="top-profile"><div className="top-avatar">{initials}</div><button className="profile-menu-button" onClick={() => void logout()} aria-label="Sign out"><ChevronDown size={14} /></button></div> : <button className="login-button" onClick={() => startLogin()}>Sign in</button>}</div></header>
      <div className="page-content">
        {activeItem === "Settings" ? <TeamAccessView /> : activeItem === "Dashboard" ? <>
          <section className="page-heading"><div><div className="eyebrow">Thursday, 18 September 2026</div><h1>Good morning, {firstName} <span>✦</span></h1><p>Here’s what’s happening across Alif Travels today.{isAuthenticated ? " Your data is connected." : " Demo data is shown until you sign in."}</p></div><div className="heading-actions"><div className="period-select"><CalendarDays size={15} /><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>This month</option><option>Last month</option><option>This quarter</option></select><ChevronDown size={13} /></div><button className="primary-button" onClick={() => setShowBooking(true)}><Plus size={16} />New booking</button></div></section>
          <section className="stat-grid"><StatCard label="Revenue" value={summary ? formatBDT(summary.revenue) : "৳ 18,64,500"} change={summary ? "live" : "18.6%"} caption={summary ? `${summary.activeBookings} bookings tracked` : "vs last month"} icon={CircleDollarSign} tone="mint" /><StatCard label="Gross profit" value={summary ? formatBDT(summary.grossProfit) : "৳ 4,28,760"} change={summary ? "live" : "12.4%"} caption={summary ? "Revenue less costs" : "vs last month"} icon={TrendingUp} tone="lavender" /><StatCard label="Active bookings" value={summary ? String(summary.activeBookings) : "248"} change={summary ? "live" : "8.2%"} caption={summary ? `${summary.customers} customers` : "vs last month"} icon={Ticket} tone="sky" /><StatCard label="Outstanding" value={summary ? formatBDT(summary.outstanding) : "৳ 6,42,300"} change={summary ? "live" : "5.1%"} caption={summary ? `${summary.visaCases} visa cases` : "vs last month"} icon={WalletCards} tone="peach" negative /></section>
          <section className="dashboard-grid top-grid"><div className="panel sales-panel"><div className="panel-head"><div><div className="panel-kicker"><span className="green-dot" />Net sales</div><div className="panel-number">{summary ? formatBDT(summary.revenue) : "৳ 18,64,500"} <span className="inline-trend">↑ 18.6%</span></div></div><div className="panel-controls"><button className="chart-legend active"><span />Sales</button><button className="chart-legend"><span className="gray-dot" />Costs</button><select defaultValue="12months"><option value="12months">Last 12 months</option><option value="6months">Last 6 months</option></select></div></div><SalesChart /></div><div className="panel pipeline-panel"><div className="panel-head"><div><div className="panel-kicker">Sales pipeline</div><div className="panel-number">৳ 76.1L <span className="muted-number">potential</span></div></div><button className="icon-button subtle"><MoreHorizontal size={18} /></button></div><div className="pipeline-list">{pipeline.map((item, index) => <div className="pipeline-item" key={item.label}><div className="pipeline-meta"><div><span className="pipeline-index">0{index + 1}</span><strong>{item.label}</strong></div><div><b>{item.value}</b><span>{item.amount}</span></div></div><div className="progress-track"><div className="progress-fill" style={{ width: `${(item.value / 126) * 100}%`, background: item.color }} /></div></div>)}</div><button className="panel-link" onClick={() => selectNav("Bookings")}>View pipeline <ArrowUpRight size={14} /></button></div></section>
          <section className="dashboard-grid bottom-grid"><div className="panel activity-panel"><div className="panel-head"><div><div className="panel-kicker">Live activity</div><div className="panel-title">Recent transactions</div></div><button className="panel-link" onClick={() => selectNav("Bookings")}>View all <ArrowUpRight size={14} /></button></div><div className="activity-table"><div className="activity-table-head"><span>Activity</span><span>Value</span><span>Status</span><span>Updated</span></div>{filteredActivities.length > 0 ? filteredActivities.map((activity) => <div className="activity-row" key={`${activity.name}-${activity.type}`}><div className="activity-cell person-cell"><div className={`person-avatar ${activity.avatar}`}>{activity.initials}</div><div><strong>{activity.name}</strong><span>{activity.type} · {activity.service}</span></div></div><div className="activity-cell amount-cell">{activity.amount}</div><div className="activity-cell"><Badge tone={activity.statusTone}>{activity.status}</Badge></div><div className="activity-cell time-cell">{activity.time}</div></div>) : <div className="empty-search"><Search size={18} />No activity matches “{search}”</div>}</div></div><div className="panel attention-panel"><div className="panel-head"><div><div className="panel-kicker">Needs attention</div><div className="panel-title">Today’s follow-ups <span className="count-pill">4</span></div></div><button className="icon-button subtle"><MoreHorizontal size={18} /></button></div><div className="followup-list"><div className="followup-item"><div className="followup-icon amber"><Clock3 size={15} /></div><div><strong>Call Maliha Karim</strong><span>UK visa · quote follow-up</span></div><span className="followup-time">10:30 AM</span></div><div className="followup-item"><div className="followup-icon purple"><FileText size={15} /></div><div><strong>Request passport copy</strong><span>Nayeem Hasan · Schengen</span></div><span className="followup-time">12:00 PM</span></div><div className="followup-item"><div className="followup-icon blue"><WalletCards size={15} /></div><div><strong>Payment reminder</strong><span>Tanvir Ahmed · ৳ 32,000 due</span></div><span className="followup-time">2:00 PM</span></div><div className="followup-item"><div className="followup-icon green"><ShieldCheck size={15} /></div><div><strong>Send visa approval</strong><span>Sanjida Rahman · UAE visit</span></div><span className="followup-time">4:30 PM</span></div></div><button className="full-width-link" onClick={() => selectNav("Tasks & follow-ups")}>Open task board <ArrowUpRight size={14} /></button></div></section>
          <section className="insight-banner"><div className="insight-orb"><Sparkles size={19} /></div><div><strong>Margin insight</strong><p>Visa processing is your fastest-growing service this month, with a <b>31.8% average margin</b>—up 6.2 points from August.</p></div><button onClick={() => selectNav("Profit & loss")}>Explore P&amp;L <ArrowUpRight size={15} /></button></section>
        </> : <ModuleView activeItem={activeItem} onAddBooking={() => setShowBooking(true)} />}
      </div>
    </main>
    {showBooking && <NewBookingModal onClose={() => setShowBooking(false)} />}
  </div>;
}

export { formatBDT };
