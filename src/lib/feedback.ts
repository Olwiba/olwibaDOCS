// Server-side feedback helpers for docs sites.
//
// TanStack Start compiles server fns from app source only, so this package
// can't ship ready-made createServerFn wrappers. Each site writes two thin
// wrappers around these helpers (~10 lines) and passes them to
// <FeedbackSidebarItem>. See the olwibaDOCS demo site's
// site/lib/feedback-server.ts for the reference wiring.

export {
  deliverFeedback,
  feedbackEnabled,
  validateFeedbackSubmission,
  type FeedbackResult,
  type FeedbackSubmission,
} from '../feedback/submission';
export { getFeedbackEmailEnv, type EmailProviderName, type FeedbackEmailEnv } from '../feedback/env';
