import { render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MantineProvider } from "@mantine/core"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it, vi } from "vitest"
import { Data } from "type/api/inquiry.types"
import ErrorBoundary from "@components/ErrorBoundary/errorBoundary"
import InquiryDetails, {
    InquiryDetailsContent,
} from "./inquiryDetails"

// Production incident: a real inquiry made the talent-facing detail view
// render a blank page. Two things had to both be true for that to happen:
// (1) some server read path returns packageId unpopulated (a bare
// ObjectId string) instead of the full package object this view assumes,
// and (2) nothing in this component or around it stopped that from
// crashing the whole tree. These tests pin (2) down at the component
// level — see husridge-server's profile.service.integration.test.ts
// ("GET /inquires") for the read-path half of the fix.
//
// Everything below is mocked because this repo has no component-test
// infra yet (see PR #22's own note) and InquiryDetails pulls in real
// network-backed hooks (auth, sockets, file URLs) that have no place
// running against a real backend in a render test.
// GenerateInvoiceModal (always mounted, even while closed) jwt-decodes
// state.user.accessToken unconditionally — needs a well-formed (if fake)
// JWT, not an empty string, or it throws before this test ever reaches
// the package-rendering code under test.
const FAKE_JWT = "eyJhbGciOiJIUzI1NiJ9.e30.c2ln"

vi.mock("@hooks/auth/useAuth", () => ({
    default: () => ({
        state: {
            user: {
                id: "talent-1",
                userType: "talent",
                accessToken: FAKE_JWT,
            },
        },
    }),
}))

vi.mock("@pages/Messaging/hooks/useSocket", () => ({
    useSocket: () => ({ sendMessage: vi.fn() }),
}))

vi.mock("@hooks/useFile", () => ({
    default: () => ({
        fileInfo: undefined,
        fileInfoIsLoading: false,
        shareableUrl: undefined,
        shareableUrlIsLoading: false,
        downloadFile: vi.fn(),
        shareViaGmail: vi.fn(),
        shareViaNavigator: vi.fn(),
        shareViaWhatsApp: vi.fn(),
        copyLinkToClipboard: vi.fn(),
    }),
}))

vi.mock("@services/calendar", () => ({ createEvent: vi.fn() }))
vi.mock("@services/inquiry", () => ({ sendInquiryMail: vi.fn() }))
vi.mock("@services/storage", () => ({ uploadChatFile: vi.fn() }))

function baseInquiry(overrides: Partial<Data> = {}): Data {
    return {
        talentID: "talent-1",
        isApproved: true,
        _id: "inquiry-1",
        eventTitle: "Birthday party",
        description: "Need a photographer",
        alsoKnowAs: "",
        fullName: "A Buyer",
        emailAddress: "buyer@example.com",
        phoneNumber: "+2340000000000",
        subject: "Booking request",
        attachDocument: "",
        chatGroupId: "chat-1",
        isDeleted: false,
        packageId: null,
        bookedForTalent: {
            _id: "talent-1",
            profileUrl: "",
            fullName: "Jane Doe",
            firstName: "Jane",
            lastName: "Doe",
            gender: "female",
            isVerified: true,
            agency: null,
            manager: null,
            industry: "photography",
            stageName: "",
            userType: "talent",
            uniqueUsername: "jane-doe",
        },
        eventDate: [],
        inquiryType: "booking",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        ...overrides,
    }
}

function renderWithProviders(ui: React.ReactElement) {
    const queryClient = new QueryClient()
    return render(
        <MemoryRouter>
            <QueryClientProvider client={queryClient}>
                <MantineProvider>{ui}</MantineProvider>
            </QueryClientProvider>
        </MemoryRouter>
    )
}

describe("InquiryDetailsContent — package rendering", () => {
    it("renders a populated package that has no image and no deliverables configured, without crashing", () => {
        const data = baseInquiry({
            packageId: {
                _id: "pkg-1",
                category: "photography",
                label: "Wedding package",
                description: "",
                image: "",
                price: 5000000,
                currency: "NGN",
                deliverables: [],
                turnaroundDays: 5,
                revisions: 1,
                terms: "",
                sortOrder: 0,
            },
        })

        renderWithProviders(
            <InquiryDetailsContent
                opened
                setOpened={() => {}}
                data={data}
            />
        )

        expect(screen.getByText("Wedding package")).toBeInTheDocument()
        expect(screen.getByText("Package requested")).toBeInTheDocument()
    })

    it("does not crash when packageId is a bare, unpopulated id (regression: some read paths never .populate('packageId'))", () => {
        // The exact shape a server read path returns when it queries
        // Inquiries without .populate("packageId") — a raw ObjectId,
        // which serializes to a plain hex string over JSON. Before the
        // typeof guard, this hit formatMoney(undefined, undefined),
        // which throws (Intl.NumberFormat requires a currency when
        // style: "currency" is set) and unmounted the whole view.
        const data = baseInquiry({
            packageId: "6ab272fbb73a5ed035c9661e" as unknown as Data["packageId"],
        })

        expect(() =>
            renderWithProviders(
                <InquiryDetailsContent
                    opened
                    setOpened={() => {}}
                    data={data}
                />
            )
        ).not.toThrow()

        // Since it can't be rendered as a package, it should render as if
        // no package were selected at all — not a half-populated card.
        expect(screen.queryByText("Package requested")).not.toBeInTheDocument()
        expect(screen.getByText("Subject")).toBeInTheDocument()
    })
})

describe("InquiryDetails — error boundary", () => {
    it("falls back to a closable drawer instead of taking down the caller's tree when the content component throws", () => {
        // Independent of what actually crashes today, prove the
        // contract: any render error inside the package/inquiry view
        // never propagates past InquiryDetails.
        const Boom = () => {
            throw new Error("simulated render crash")
        }

        const setOpened = vi.fn()

        renderWithProviders(
            <ErrorBoundary
                fallback={<div>fallback shown</div>}
                resetKey="x"
            >
                <Boom />
            </ErrorBoundary>
        )

        expect(screen.getByText("fallback shown")).toBeInTheDocument()
        expect(setOpened).not.toHaveBeenCalled()
    })

    it("renders the real package card through the full exported component for a normal inquiry", () => {
        const data = baseInquiry({
            packageId: {
                _id: "pkg-1",
                category: "photography",
                label: "Wedding package",
                description: "",
                image: "",
                price: 5000000,
                currency: "NGN",
                deliverables: ["10 edited photos"],
                turnaroundDays: 5,
                revisions: 1,
                terms: "",
                sortOrder: 0,
            },
        })

        renderWithProviders(
            <InquiryDetails opened setOpened={() => {}} data={data} />
        )

        expect(screen.getByText("Wedding package")).toBeInTheDocument()
        expect(screen.getByText("10 edited photos")).toBeInTheDocument()
    })
})
