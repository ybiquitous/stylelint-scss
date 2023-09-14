"use strict";

const { messages, ruleName } = require("..");

testRule({
  ruleName,
  config: [true],
  customSyntax: "postcss-scss",

  accept: [
    {
      code: `
      .a { @at-root .b { c: d } }
      `,
      description: "@at-root rule is nested."
    },
    {
      code: `
      .a { @at-root .b#{&} { c: d; } }
      `,
      description:
        "@at-root is followed by a selector with an interpolated `&`."
    },
    {
      code: `
      .a { @at-root .b { .c & { d: e; } } }
      `,
      line: 2,
      column: 12,
      message: messages.rejected,
      description: "A parent selector (&) is used under the @at-root rule."
    },
    {
      code: `
      .a {
        @at-root .b {
          @keyframes slidein {
            from {
              transform: translateX(0%);
            }
          
            to {
              transform: translateX(100%);
            }
          }
        }
      }`,
      description: "@at-root outside a keyframes block, nested."
    },
    {
      code: `
      @mixin foo {}
      
      @keyframes slidein {
        from {
          @include foo;
          transform: translateX(0%);
        }
      
        to {
          transform: translateX(100%);
        }
      }`,
      description: "Other at-rules nested inside @keyframes block."
    }
  ],
  reject: [
    {
      code: `
      @at-root .a { b: c; }
      `,
      line: 2,
      column: 7,
      message: messages.rejected,
      description: "@at-root rule is already in the root."
    },
    {
      code: `
      .a { @at-root .b & { c: d; } }
      `,
      line: 2,
      column: 12,
      message: messages.rejected,
      description:
        "@at-root is followed by a selector with a `&` outside an interpolation."
    },
    {
      code: `
      .a { @at-root .b & #{.c} { d: e; } }
      `,
      line: 2,
      column: 12,
      message: messages.rejected,
      description:
        "@at-root is followed by a selector with a `&` outside an interpolation."
    },
    {
      code: `
      @keyframes slidein {
        @at-root from {
          transform: translateX(0%);
        }
      
        to {
          transform: translateX(100%);
        }
      }`,
      line: 3,
      column: 9,
      message: messages.rejected,
      description: "@at-root inside a keyframes block, top level."
    },
    {
      code: `
      @keyframes slidein {
        from {
          transform: translateX(0%);
             @at-root from {
              transform: translateX(100%);
             }
             to {
                transform: translateX(0%);
              }
        }
      
        to {
          transform: translateX(100%);
        }
      }`,
      line: 5,
      column: 14,
      message: messages.rejected,
      description: "@at-root inside a @keyframes block, nested."
    }
  ]
});