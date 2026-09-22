import { Component, ErrorInfo, ReactNode } from "react"

export interface ErrorBoundaryProps {
    children: ReactNode
    // Rendered in place of children once a descendant has thrown during
    // render. Kept per-instance (not a single global fallback) so each
    // boundary can offer a way out appropriate to what it wraps — e.g. a
    // modal's fallback still needs to be closable.
    fallback: ReactNode
    // Data whose identity marks "a different thing is being shown now" —
    // when it changes after an error, the boundary resets and gives the
    // new content a fresh chance to render instead of being stuck on the
    // previous failure forever.
    resetKey?: unknown
}

interface ErrorBoundaryState {
    hasError: boolean
    resetKey?: unknown
}

// A single malformed record crashing one view's render must never take
// down the rest of the page with it — React unmounts the whole tree on an
// uncaught render error, and this repo has no boundary anywhere else to
// stop that. Class component because getDerivedStateFromError/
// componentDidCatch have no hook equivalent.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    static getDerivedStateFromProps(
        props: ErrorBoundaryProps,
        state: ErrorBoundaryState
    ) {
        if (state.hasError && props.resetKey !== state.resetKey) {
            return { hasError: false, resetKey: props.resetKey }
        }
        if (props.resetKey !== state.resetKey) {
            return { resetKey: props.resetKey }
        }
        return null
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ErrorBoundary caught a render error:", error, info.componentStack)
    }

    render() {
        return this.state.hasError ? this.props.fallback : this.props.children
    }
}

export default ErrorBoundary
