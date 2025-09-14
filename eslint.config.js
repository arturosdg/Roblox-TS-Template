import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import robloxTs from 'eslint-plugin-roblox-ts';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    {
        files: ['**/*.ts', '**/*.tsx'],
        ignores: ['node_modules/**', 'out/**', 'include/**'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                jsx: true,
                useJSXTextNode: true,
                ecmaVersion: 2018,
                sourceType: 'module',
                project: './tsconfig.json'
            }
        },
        plugins: {
            '@typescript-eslint': typescriptEslint,
            'roblox-ts': robloxTs,
            'prettier': prettier
        },
        rules: {
            ...typescriptEslint.configs['recommended-type-checked'].rules,
            ...typescriptEslint.configs['stylistic-type-checked'].rules,
            ...prettierConfig.rules,

            'prettier/prettier': [
                'warn',
                {
                    printWidth: 120,
                    tabWidth: 4,
                    trailingComma: 'all',
                    useTabs: true,
                    endOfLine: 'auto'
                }
            ],
            '@typescript-eslint/array-type': ['error', {default: 'generic'}],
            'roblox-ts/no-private-identifier': 'off',
            '@typescript-eslint/prefer-nullish-coalescing': 'off',
            '@typescript-eslint/no-empty-object-type': 'off'
        }
    }
];
