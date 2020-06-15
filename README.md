# Union Frontend

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![follow: @unionprotocol](https://badgen.net/twitter/follow/unionprotocol)](https://twitter.com/unionprotocol)

The open source interface for Union.

- Website: [union.finance](https://union.finance)
- Twitter: [@unionprotocol](https://twitter.com/unionprotocol)
- Blog: [medium.com](https://medium.com/union-finance)

## Develop Locally

Always create a new branch off of `develop`.

_Note:_ If you want to use WalletConnect or Fortmatic to test while building make a copy of .env.local.example named .env.local, change NEXT_PUBLIC_INFURA_KEY to "{yourKey}", and change NEXT_PUBLIC_FORTMATIC_API_KEY to "{yourFortmaticTestKey}", and if needed change NEXT_PUBLIC_IPAPI_KEY to "{yourIPAPIKey}".

### Install dependencies

```bash
yarn
```

### Start server

```bash
yarn dev
```

## Open browser

Navigate to example at [http://localhost:3000/](http://localhost:3000/).

## Contributions

**Please open all pull requests against the `develop` branch**. ~Zeit~ Vercel builds will run against all PRs.
