# Breadcrumb Solution

## Summary

This is a SPFx extension. To provide a better user experience while navigating to different site pages, this solution will enable the breadcrumb functionality within SharePoint Online modern site pages based on a custom Parent Child relationship.
This solution works on these four columns from SIte pages library.
1. Title
2. FileRef
3. ID
4. ParentID (cutom numeric column)


## Used SharePoint Framework Version

SPFx 1.19

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

> Need to create a custom coumn named ParentID on the desired SharePoint site. The type of the coumn would be Numeric.

## Solution

| Solution        | Author(s)                                               |
| --------------- | ------------------------------------------------------- |
| SPFx_Breadcrumb | Ankur Chaudhary || https://www.linkedin.com/in/ankur-chaudhary-75411a48|

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.0     | Nov 21, 2024   | Initial release  |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Please refer the pre requisites section before gulp serve.

## Features

This is a SPFx extension. This solution will enable the breadcrumb functionality within SharePoint Online modern site pages based on a custom Parent Child relationship.

This extension illustrates the following concepts:

- SPFx application extension
- Breadcrumb
- Easy navigation


## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development
