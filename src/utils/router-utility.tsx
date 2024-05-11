import React from 'react'

export function lazyWithPreload(factory: any) {
  const Component: any = React.lazy(factory)
  Component.preload = factory
  return Component
}
