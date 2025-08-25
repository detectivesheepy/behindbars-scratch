/*
   BehindBars extension
   Play around with runtime that is usually locked away
*/
(async function(Scratch) {
    const variables = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    const ExtForge = {
        Broadcasts: new function() {
            this.raw_ = {};
            this.register = (name, blocks) => {
                this.raw_[name] = blocks;
            };
            this.execute = async (name) => {
                if (this.raw_[name]) {
                    await this.raw_[name]();
                };
            };
        },

        Variables: new function() {
            this.raw_ = {};
            this.set = (name, value) => {
                this.raw_[name] = value;
            };
            this.get = (name) => {
                return this.raw_[name] ?? null;
            }
        },

        Vector: class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            static from(v) {
                if (v instanceof ExtForge.Vector) return v
                if (v instanceof Array) return new ExtForge.Vector(Number(v[0]), Number(v[1]))
                if (v instanceof Object) return new ExtForge.Vector(Number(v.x), Number(v.y))
                return new ExtForge.Vector()
            }

            add(v) {
                return new Vector(this.x + v.x, this.y + v.y);
            }

            set(x, y) {
                return new Vector(x ?? this.x, y ?? this.y)
            }
        }

        Utils: {
            setList: (list, index, value) => {
                [...list][index] = value;
                return list;
            },
            lists_foreach: {
                index: [0],
                value: [null],
                depth: 0
            },
            countString: (x, y) => {
                return y.length == 0 ? 0 : x.split(y).length - 1
            }
        }
    }

    class Extension {
        getInfo() {
            return {
                "id": "behindbars-runtime",
                "name": "BehindBars",
                "color1": "#8ac1b2",
                "blocks": [{
                    "opcode": "block_f0bc6533f156bca4",
                    "text": "before/after tick?",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_fe5d5ba12ce3500a",
                    "text": "set alwaysrun to true",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_849c2047d78e810b",
                    "text": "set alwaysrun to false",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_dc2158e6e418ee62",
                    "text": "alwaysrun",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_0d4fb7508841861c",
                    "text": "set fps to [78e625558725e156]",
                    "blockType": "command",
                    "arguments": {
                        "78e625558725e156": {
                            "type": "number",
                            "defaultValue": 30
                        }
                    }
                }, {
                    "opcode": "block_67fc4501dc4f8033",
                    "text": "click flag on behalf of user",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_c99883e37e2c0628",
                    "text": "running?",
                    "blockType": "Boolean",
                    "arguments": {}
                }]
            }
        }
        async block_f0bc6533f156bca4(args) {
            return (ExtForge.Variables.get("tick"))
        }
        async block_fe5d5ba12ce3500a(args) {
            ExtForge.Variables.set("alwaysrun", Scratch.Cast.toString(("true")))
        }
        async block_849c2047d78e810b(args) {
            ExtForge.Variables.set("alwaysrun", Scratch.Cast.toString(("false")))
        }
        async block_dc2158e6e418ee62(args) {
            return (ExtForge.Variables.get("alwaysrun"))
        }
        async block_0d4fb7508841861c(args) {
            Scratch.vm.runtime.frameLoop.setFramerate(args["78e625558725e156"]);
        }
        async block_67fc4501dc4f8033(args) {
            Scratch.vm.greenFlag();
        }
        async block_c99883e37e2c0628(args) {
            return ((Scratch.vm.runtime.threads.length > 0))
        }
    }

    let extension = new Extension();
    // code compiled from extforge
    Scratch.vm.on('PROJECT_RUN_STOP', (async () => {
        if ((ExtForge.Variables.get("alwaysrun") ==
                ("true"))) {
            Scratch.vm.greenFlag();
            console.log(("alwaysrun click the flag"));
        };
    }));
    Scratch.vm.on('BEFORE_EXECUTE', (async () => {
        ExtForge.Variables.set("tick", Scratch.Cast.toString(("before")))
    }));
    Scratch.vm.on('AFTER_EXECUTE', (async () => {
        ExtForge.Variables.set("tick", Scratch.Cast.toString(("after")))
    }));

    Scratch.extensions.register(extension);
})(Scratch);
Blocks
Properties
