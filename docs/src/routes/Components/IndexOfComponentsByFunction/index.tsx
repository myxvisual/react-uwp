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
import Menu from "../Menu/SimpleExample";
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

export default class IndexOfComponentsByFunction extends React.Component<any> {
  static contextTypes = { theme: PropTypes.object };
  context: { theme: ReactUWP.ThemeType };

  render() {
    const {
      location,
      params,
      route,
      router,
      routeParams,
      routes,
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
The UI framework for Windows provides an extensive library of controls that support UI development. Some of these controls have a visual representation; others function as the containers for other controls or content, such as images and media.`
          }
        />

        <MarkdownRender text="> AppBarButton" />
        <AppBarButton />

        <MarkdownRender text="> AutoSuggestBox" />
        <AutoSuggestBox />

        <MarkdownRender text="> Button" />
        <Button />

        <MarkdownRender text="> CheckBox" />
        <CheckBox />

        <MarkdownRender text="> CommandBar" />
        <CommandBar />

        <MarkdownRender text="> ContentDialog" />
        <ContentDialog />

        <MarkdownRender text="> CalendarView" />
        <CalendarView />

        <MarkdownRender text="> CalendarDatePicker" />
        <CalendarDatePicker />

        <MarkdownRender text="> DatePicker" />
        <DatePicker />

        <MarkdownRender text="> TimePicker" />
        <TimePicker />

        <MarkdownRender text="> DropDownMenu" />
        <DropDownMenu />

        <MarkdownRender text="> Flyout" />
        <Flyout />

        <MarkdownRender text="> HyperLink" />
        <HyperLink />

        <MarkdownRender text="> Icon" />
        <Icon />

        <MarkdownRender text="> IconButton" />
        <IconButton />

        <MarkdownRender text="> PasswordBox" />
        <PasswordBox />

        <MarkdownRender text="> ProgressBar" />
        <ProgressBar />

        <MarkdownRender text="> ProgressRing" />
        <ProgressRing />

        <MarkdownRender text="> RadioButton" />
        <RadioButton />

        <MarkdownRender text="> RatingControl" />
        <RatingControl />

        <MarkdownRender text="> ScrollReveal" />
        <ScrollReveal />

        <MarkdownRender text="> Separator" />
        <Separator />

        <MarkdownRender text="> Slider" />
        <Slider />

        <MarkdownRender text="> SplitViewCommand" />
        <SplitViewCommand />

        <MarkdownRender text="> TextBox" />
        <TextBox />

        <MarkdownRender text="> Toggle" />
        <Toggle />

        <MarkdownRender text="> Tooltip" />
        <Tooltip />

        <MarkdownRender text="> TreeView" />
        <TreeView />

        <MarkdownRender text="> Menu" />
        <Menu />

        <MarkdownRender text="> ListView" />
        <ListView />

        <MarkdownRender text="> Image" />
        <Image />

        <MarkdownRender text="> FlipView" />
        <FlipView />

        <MarkdownRender text="> NavigationView" />
        <NavigationView />

        <MarkdownRender text="> SplitView" />
        <SplitView />
      </div>
    );
  }
}
