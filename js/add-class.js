{
  let breakpoint = ""
  const htmlRoot = document.documentElement
  const callback = (event) => {
    const cssVar = getComputedStyle(htmlRoot).getPropertyValue("--breakpoint")
    if (breakpoint !== cssVar) {
      htmlRoot.classList.remove(breakpoint)
      breakpoint = cssVar
      if (breakpoint !== "") {
        htmlRoot.classList.add(breakpoint)
      }
    }
  }
  window.addEventListener("resize", callback)
  window.addEventListener("load", callback)
}