import * as React from "react";
import RevealItem from "./RevealItem";

export default function addRevealItem<T>(Cpt: T): T {
    let AnyCpt: any = Cpt;
    return (
        (props: any) => <RevealItem><AnyCpt {...props} /></RevealItem>
    ) as any;
}
