import * as revealEffect from "../build/index";

revealEffect.setRevealConfig({
    hoverColor: "rgba(255, 255, 255, .4)",
    borderWidth: 2
});

revealEffect.addRevealEl(document.body);
revealEffect.addRevealItem({ element: document.body, hoverSize: 200 });
