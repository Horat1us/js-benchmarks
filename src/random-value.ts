import { benchmark } from "./benchmark";

benchmark('random value',
    function FromArray() {
        const values = ['up', 'down', 'null'];
        const response = new Array(1000000)
            .fill(undefined)
            .map(() => values[ Math.round(Math.random() * values.length) ]);
        return response.reduce((o: any, c) => {
            o[ c ]++;
            return o;
        }, { up: 0, down: 0, null: 0 });
    },
    function FromCondition() {
        const response = new Array(1000000)
            .fill(undefined)
            .map(() => (Math.random() > 0.66 ? 'up' : (Math.random() > 0.5 ? 'down' : 'null')));
        return response.reduce((o: any, c) => {
            o[ c ]++;
            return o;
        }, { up: 0, down: 0, null: 0 });
    },
);
