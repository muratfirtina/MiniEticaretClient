export class Menu {
    name: string;
    actions:Action[];
}

export class Action {
    actionTyoe: string;
    httpType: string;
    definition: string;
    code: string;
}