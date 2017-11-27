import * as React from "react";

import CommandBar from "react-uwp/CommandBar";
import AppBarButton from "react-uwp/AppBarButton";
import AppBarSeparator from "react-uwp/AppBarSeparator";

const commandBarStyle: React.CSSProperties = {
  margin: "30px 0"
};
export default class SimpleExample extends React.Component {
  render() {
    const secondaryCommands = [
      <p>Open with</p>,
      <p>Print</p>,
      <p>Set as</p>,
      <p>View actual size</p>,
      <AppBarSeparator />,
      <p>File info</p>,
      <AppBarSeparator />,
      <p>Send feedback</p>
    ];
    return (
      <div>
        <CommandBar
          background="transparent"
          content="Now Playing..."
          primaryCommands={[
            <AppBarButton icon="Shuffle" label="Shuffle" />,
            <AppBarButton icon="RepeatAll" label="Repeat" />,
            <AppBarSeparator />,
            <AppBarButton icon="Back" label="Back" />,
            <AppBarButton icon="Stop" label="Stop" />,
            <AppBarButton icon="Play" label="Play" />,
            <AppBarButton icon="Forward" label="Forward" />,
            <div>Will not render this item.</div>
          ]}
          secondaryCommands={secondaryCommands}
          style={commandBarStyle}
        />
        <CommandBar
          labelPosition="right"
          flowDirection="row-reverse"
          primaryCommands={[
            <AppBarButton icon="Shuffle" label="Shuffle" />,
            <AppBarButton icon="RepeatAll" label="Repeat" />,
            <AppBarSeparator />,
            <AppBarButton icon="Back" label="Back" />,
            <AppBarButton icon="Stop" label="Stop" />,
            <AppBarButton icon="Play" label="Play" />,
            <AppBarButton icon="Forward" label="Forward" />,
            <div>Will not render this item.</div>
          ]}
          style={commandBarStyle}
        />
        <CommandBar
          labelPosition="collapsed"
          primaryCommands={[
            <AppBarButton icon="Shuffle" label="Shuffle" />,
            <AppBarButton icon="RepeatAll" label="Repeat" />,
            <AppBarSeparator />,
            <AppBarButton icon="Back" label="Back" />,
            <AppBarButton icon="Stop" label="Stop" />,
            <AppBarButton icon="Play" label="Play" />,
            <AppBarButton icon="Forward" label="Forward" />,
            <div>Will not render this item.</div>
          ]}
          style={commandBarStyle}
        />
        <CommandBar
          isMinimal
          labelPosition="right"
          primaryCommands={[
            <AppBarButton icon="Share" label="Share" />,
            <AppBarButton icon="Zoom" label="Zoom" />,
            <AppBarSeparator />,
            <AppBarButton icon="Picture" label="SlideShow" />,
            <AppBarButton icon="Draw" label="Draw" />,
            <AppBarButton icon="Edit" label="Edit" />,
            <AppBarButton icon="Rotate" label="Rotate" />,
            <div>Will not render this item.</div>
          ]}
          secondaryCommands={secondaryCommands}
          style={{ display: "block", ...commandBarStyle }}
        />
      </div>
    );
  }
}
