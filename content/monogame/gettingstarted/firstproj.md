---
title: "First Project"
description: ""
summary: ""
date: 2024-06-26T00:00:00+00:00
lastmod: 2024-06-26T00:00:00+00:00
draft: false
weight: 90
toc: true
seo:
  title: "" # custom title (optional)
  description: "" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

Getting started is pretty straight forward - regardless of the platform or tool chain that you've decided
on. The most difficult decision will be deciding on a project structure.

Supporting a single platform is simple, you would create a single platform specific project.

## Simple Start

The below will create an empty desktop project supporting OpenGL.

{{< tabs "installdeps" >}}
{{< tab "VS Code / CLI" >}}
```shell
dotnet new mgdekstopgl -o AwesomeGame
cd AwesomeGame
code .
```
{{< /tab >}}
{{< tab "Rider" >}}
![Rider New Project](ridernewproj.png)
{{< /tab >}}
{{< tab "Visual Studio" >}}
![Visual Studio New Project](visualstudionew.png)
{{< /tab >}}
{{< /tabs >}}

## Available Templates

| Cli Name    | Template                           |
|-------------|------------------------------------|
| mgdesktopgl | Cross Platform Desktop Application |
| mgdesktopdx | Windows Desktop Application        |
| mgshared    | MonoGame Shared Library            |
| mglib       | MonoGame Game Library              |
| mgandroid   | MonoGame Android Application       |
| mgpipeline  | Content Pipeline Extension         |
