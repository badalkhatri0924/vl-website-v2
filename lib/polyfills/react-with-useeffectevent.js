/**
 * React wrapper that includes useEffectEvent polyfill
 * This is used to fix Sanity Studio compatibility with React 19
 */
const React = require('react')
const { useEffectEvent } = require('./useEffectEvent')

// Re-export everything from react, including default if it exists
const ReactExports = { ...React }

// Add useEffectEvent polyfill
ReactExports.useEffectEvent = useEffectEvent

// Preserve default export if it exists
if (React.default) {
  ReactExports.default = React.default
}

module.exports = ReactExports

