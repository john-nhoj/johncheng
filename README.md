This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/zeit/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Google Cloud Platform

I have used Terraform to control the infrastructure in Google Cloud Platform.

This project has:

- a source repository
- a cloudbuild pipeline
- a Kubernetes cluster

### Architecture

### Kubernetes cluster

![Kubernetes architecture](readme_assets/k8s.png 'Kubernetes architecture')
