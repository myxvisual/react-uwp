export function handleScrollReveal(theme: ReactUWP.ThemeType) {
  for (const scrollReveal of theme.scrollReveals) {
    const {
      rootElm,
      animated,
      setEnterStyle,
      setLeaveStyle,
      props: {
        topOffset,
        bottomOffset
      }
    } = scrollReveal;
    if (!rootElm) return;
    const { top, height } = rootElm.getBoundingClientRect();
    const { innerHeight } = window;

    let isIn = false;
    if (height > innerHeight) {
      isIn = top < innerHeight - height * height && top > - height * 0.5;
    } else {
      isIn = top > 0 + topOffset && top + height + bottomOffset < innerHeight;
    }
    if (isIn) {
      if (!animated) {
        setEnterStyle();
        scrollReveal.animated = true;
      }
    } else {
      if (animated) {
        setLeaveStyle();
        scrollReveal.animated = false;
      }
    }
  }
}
