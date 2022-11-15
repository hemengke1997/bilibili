export { Page }

function Page({ is404, errorInfo }: { is404: boolean; errorInfo?: string }) {
  if (is404) {
    return (
      <>
        <h1>404 Page Not Found</h1>
        <p>[vite-ssr]: This page could not be found!</p>
        <p>{errorInfo}</p>
      </>
    )
  } else {
    return (
      <>
        <h1>500 Internal Server Error</h1>
        <p>[vite-ssr]: Something went wrong!</p>
      </>
    )
  }
}
