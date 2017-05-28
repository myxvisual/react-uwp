import * as React from "react";

import CommandBar from "react-uwp/CommandBar";
import AppBarButton from "react-uwp/AppBarButton";
import AppBarSeparator from "react-uwp/AppBarSeparator";

const commandBarStyle: React.CSSProperties = {
  margin: "60px 0"
};
export default class SimpleExample extends React.Component<void, void> {
  render() {
    return (
      <div>
        <CommandBar
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
          style={commandBarStyle}
        />
        <CommandBar
          labelPosition="right"
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
          style={{ display: "block", ...commandBarStyle }}
        />
      </div>
    );
  }
}
