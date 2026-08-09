import * as React from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type ErrorBoundaryProps = {
  children?: ReactNode
  fallback?: ReactNode
  // Quando este valor muda, o boundary volta a tentar renderizar os children.
  resetKey?: unknown
}

type ErrorBoundaryState = {
  hasError: boolean
  resetKey?: unknown
}

function logErrorToMyService(
  error: unknown,
  componentStack: string | null | undefined,
  ownerStack: string | null,
) {
  console.error(error, componentStack, ownerStack)
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, resetKey: props.resetKey }
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  static getDerivedStateFromProps(
    props: ErrorBoundaryProps,
    state: ErrorBoundaryState,
  ): ErrorBoundaryState | null {
    if (props.resetKey !== state.resetKey) {
      return { hasError: false, resetKey: props.resetKey }
    }

    return null
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logErrorToMyService(
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    )
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}
