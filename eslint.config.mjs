import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Fix unused variables/expressions warnings
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-unused-expressions": ["error", {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }],
      
      // Fix require() imports
      "@typescript-eslint/no-require-imports": "error",
      
      // Additional recommended rules
      "no-console": "warn",
      "react-hooks/exhaustive-deps": "warn"
    },
    overrides: [
      {
        // For generated files (like Prisma's wasm.js)
        files: ["**/generated/**/*.js"],
        rules: {
          "@typescript-eslint/no-require-imports": "off",
          "@typescript-eslint/no-unused-vars": "off",
          "@typescript-eslint/no-unused-expressions": "off"
        }
      }
    ]
  }
];

export default eslintConfig;