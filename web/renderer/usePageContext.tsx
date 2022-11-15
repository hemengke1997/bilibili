import React, { useContext } from 'react'

export { PageContextProvider }
export { usePageContext }

const Context = React.createContext<PageType.PageContext>(undefined as any)

function PageContextProvider({
  pageContext,
  children,
}: {
  pageContext: PageType.PageContext
  children: React.ReactNode
}) {
  return <Context.Provider value={pageContext}>{children}</Context.Provider>
}

function usePageContext() {
  const pageContext = useContext(Context)
  return pageContext
}
