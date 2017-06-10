import * as React from "react";
import * as PropTypes from "prop-types";

import MarkdownRender from "react-uwp/MarkdownRender";

import AppBarButton from "../AppBarButton/SimpleExample";
import AutoSuggestBox from "../AutoSuggestBox/SimpleExample";
import Button from "../Button/SimpleExample";
import CheckBox from "../CheckBox/SimpleExample";
import ColorPicker from "../ColorPicker/SimpleExample";
import CommandBar from "../CommandBar/SimpleExample";
import ContentDialog from "../ContentDialog/SimpleExample";
import CalendarDatePicker from "../DatePickers/CalendarDatePicker/SimpleExample";
import CalendarView from "../DatePickers/CalendarView/SimpleExample";
import DatePicker from "../DatePickers/DatePicker/SimpleExample";
import TimePicker from "../DatePickers/TimePicker/SimpleExample";
import DropDownMenu from "../DropDownMenu/SimpleExample";
import FlipView from "../FlipView/SimpleExample";
import Flyout from "../Flyout/SimpleExample";
import HyperLink from "../HyperLink/SimpleExample";
import Icon from "../Icon/SimpleExample";
import IconButton from "../IconButton/SimpleExample";
import Image from "../Image/SimpleExample";
import ListView from "../ListView/SimpleExample";
import MediaPlayer from "../MediaPlayer/SimpleExample";
import NavigationView from "../NavigationView/SimpleExample";
import PasswordBox from "../PasswordBox/SimpleExample";
import ProgressBar from "../ProgressBar/SimpleExample";
import ProgressRing from "../ProgressRing/SimpleExample";
import RadioButton from "../RadioButton/SimpleExample";
import RatingControl from "../RatingControl/SimpleExample";
import ScrollReveal from "../ScrollReveal/SimpleExample";
import Separator from "../Separator/SimpleExample";
import Slider from "../Slider/SimpleExample";
import SplitView from "../SplitView/SimpleExample";
import SplitViewCommand from "../SplitViewCommand/SimpleExample";
import TextBox from "../TextBox/SimpleExample";
import Toggle from "../Toggle/SimpleExample";
import Tooltip from "../Tooltip/SimpleExample";
import TreeView from "../TreeView/SimpleExample";

export default class IndexOfComponentsByFunction extends React.Component<any, void> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      location, // tslint:disable-line:no-unused-variable
      params, // tslint:disable-line:no-unused-variable
      route, // tslint:disable-line:no-unused-variable
      router, // tslint:disable-line:no-unused-variable
      routeParams, // tslint:disable-line:no-unused-variable
      routes, // tslint:disable-line:no-unused-variable
      ...attributes
    } = this.props;
    const baseStyle: React.CSSProperties = {
      margin: 10
    };
    const { theme } = this.context;

    return (
      <div {...attributes}>
        <MarkdownRender
          text={
`# Components
---
The UI framework for Windows provides an extensive library of controls that support UI development. Some of these controls have a visual representation; others function as the containers for other controls or content, such as images and media.`
          }
        />

        <AppBarButton />
        <AutoSuggestBox />
        <Button />
        <CheckBox />
        <CommandBar />
        <ContentDialog />
        <CalendarView />
        <CalendarDatePicker />
        <DatePicker />
        <TimePicker />
        <DropDownMenu />
        <Flyout />
        <HyperLink />
        <Icon />
        <IconButton />
        <PasswordBox />
        <ProgressBar />
        <ProgressRing />
        <RadioButton />
        <RatingControl />
        <ScrollReveal />
        <Separator />
        <Slider />
        <SplitViewCommand />
        <TextBox />
        <Toggle />
        <Tooltip />
        <TreeView />
        <ListView />
        <Image />
        <FlipView />
        <ColorPicker />
        <MediaPlayer />
        <NavigationView />
        <SplitView />
      </div>
    );
  }
}
