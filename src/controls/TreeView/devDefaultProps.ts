import { DataProps } from "./index";

export default {
  listItems: [
    {
      titleNode: "parent1",
      expanded: true,
      children: [
        { titleNode: "parent1-Child" }
      ]
    },
    {
      titleNode: "parent2",
      expanded: false,
      children: [
        {
          titleNode: "parent2-parent1",
          children: [
            { titleNode: "parent2-parent1-child-333333333333333333333333333333333333333333333333333333333" }
          ]
        }
      ]
    }
  ]
} as DataProps;
