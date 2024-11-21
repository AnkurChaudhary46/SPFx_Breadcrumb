import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
//import { Dialog } from '@microsoft/sp-dialog';
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItem } from "@pnp/sp/items";
import { Caching } from "@pnp/queryable";
import styles from './PagehierarchyApplicationCustomizer.module.scss';

import * as strings from 'PagehierarchyApplicationCustomizerStrings';

const LOG_SOURCE: string = 'PagehierarchyApplicationCustomizer';

export interface IPagehierarchyApplicationCustomizerProperties {
  // This is an example; replace with your own property
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class PagehierarchyApplicationCustomizer
  extends BaseApplicationCustomizer<IPagehierarchyApplicationCustomizerProperties> {

  //private topPlaceholder: PlaceholderContent | undefined;

  public async onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);
    this.context.application.navigatedEvent.add(this, this.customfunc);
    //await this.customfunc();
    return Promise.resolve();
  }

  private async customfunc() {
    try {
      const sp = spfi().using(SPFx(this.context));
      const pages = await this.getAllPages(sp);
      console.log("Pages: ", pages);
      const currentPageId = this.context.pageContext.listItem?.id;
      if (currentPageId) {
        const breadcrumb = this.buildBreadcrumb(pages, currentPageId);
        this.renderBreadcrumb(breadcrumb);
      }
    } catch (error) {
      console.error("Error fetching pages: ", error);
    }
  }

  private async getAllPages(sp: any): Promise<IItem[]> {
    try {
      const pages = await sp.web.lists.getByTitle('Site Pages').items.select('ID', 'Title', 'ParentID', 'FileRef')
        .top(5000)
        .using(Caching())
        ();
      return pages;
    } catch (error) {
      console.error("Error retrieving SitePages: ", error);
      throw error;
    }
  }

  private buildBreadcrumb(pages: any[], currentPageId: number): any[] {
    const breadcrumb = [];
    let pageId = currentPageId;
    while (pageId) {
      const currentPage = pages.find(page => page.ID === pageId);
      if (currentPage) {
        breadcrumb.unshift({ title: currentPage.Title, url: currentPage.FileRef, id: currentPage.ID });
        pageId = currentPage.ParentID; // Get parent page ID
      } else {
        break;
      }
    }
    return breadcrumb;
  }

  private toggleDropdown(event: Event): void {
    event.preventDefault();
    const dropdown = document.getElementById('breadcrumb-dropdown');
    if (dropdown) {
      if (dropdown.style.display === '')
        dropdown.style.display = 'none';
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
  }

  private generateBreadcrumbHtml(breadcrumb: any[]): string {
    return breadcrumb.map((item, index) => {
      if (index < breadcrumb.length - 1) {
        return `<span class="${styles.spancontainer}"><a class="${styles.breadcrumbContainer}" href="${item.url}">${item.title}</a><span class="${styles.breadcrumbContainerSign}"> ></span></span>`;
      } else {
        return `<span class="${styles.spancontainer}"><a class="${styles.breadcrumbContainer}" style="color:#0a0a0a" href="${item.url}">${item.title}</a></span>`;
      }
    }).join('');
  }

  private renderBreadcrumb(breadcrumb: any[]): void {
    if (breadcrumb.length == 1)
      return;
    // Render the initial breadcrumb items
    let breadcrumbHtml = this.generateBreadcrumbHtml(breadcrumb);
    // Locate the element to insert the breadcrumb after the title section
    //const titleSection = document.querySelector('#pageTitle'); // or use a different selector based on the page structure
    // create a cosntant to find an element that conatins string in id
    const titleSection = document.querySelector('[id*="vpc_WebPart.PageTitle.internal"]'); // or use a different selector based on the page structure
    if (titleSection) {
      let existingBreadcrumbContainer = document.getElementById('breadcrumb-container');
      if (existingBreadcrumbContainer) {
        existingBreadcrumbContainer.remove();
      }
      // Create a container for the breadcrumb
      const breadcrumbContainer = document.createElement('div');
      breadcrumbContainer.id = 'breadcrumb-container';
      breadcrumbContainer.innerHTML = breadcrumbHtml;
      breadcrumbContainer.style.visibility = 'hidden';
      breadcrumbContainer.className = styles.breadcrumbcontainerNew;
      breadcrumbContainer.style.paddingLeft = '10px';
      breadcrumbContainer.style.paddingTop = '10px';
      titleSection.insertAdjacentElement('afterend', breadcrumbContainer);
      setTimeout(() => {
        breadcrumbContainer.style.visibility = 'visible';
      }, 1000);

      const checkOverflow = () => {
        const singleLineHeight = breadcrumbContainer.clientHeight;

        // Function to update the breadcrumb container's content
        const updateBreadcrumbContainer = (breadcrumbHtml: any) => {
          let breadcrumbHtmlinternal = this.generateBreadcrumbHtml(breadcrumb);
          breadcrumbContainer.innerHTML = breadcrumbHtml + breadcrumbHtmlinternal;
          const toggleLink = document.getElementById('breadcrumb-toggle');
          if (toggleLink) {
            toggleLink.addEventListener('click', this.toggleDropdown.bind(this));
          }
        };

        // Initial update of the breadcrumb container
        updateBreadcrumbContainer('');

        while (breadcrumbContainer.scrollHeight > singleLineHeight && breadcrumb.length > 1) {
          breadcrumbHtml = '';
          const firstItem = breadcrumb.shift();
          const dropdown = document.getElementById('breadcrumb-dropdown');
          if (dropdown) {
            dropdown.innerHTML = `<a class="${styles.dropdownItems}" href="${firstItem.url}">${firstItem.title}</a>` + dropdown.innerHTML;
            breadcrumbHtml = `<span class="${styles.spancontainer}"><a id="breadcrumb-toggle" href="#" class="${styles.breadcrumbContainer}">...</a><span class="${styles.breadcrumbContainerSign}"> ></span><div id="breadcrumb-dropdown" class="${styles.dropdownContent}">` + dropdown.innerHTML + `</div></span>`;
          } else {
            breadcrumbHtml = `<span class="${styles.spancontainer}"><a id="breadcrumb-toggle" href="#" class="${styles.breadcrumbContainer}">...</a><span class="${styles.breadcrumbContainerSign}"> ></span><div id="breadcrumb-dropdown" class="${styles.dropdownContent}"><a class="${styles.dropdownItems}" href="${firstItem.url}">${firstItem.title}</a></div></span>`;
          }
          updateBreadcrumbContainer(breadcrumbHtml);
        }
        // Add event listener to the document to close the dropdown on any click
        document.addEventListener('click', (event) => {
          const dropdown = document.getElementById('breadcrumb-dropdown');
          const toggleLink = document.getElementById('breadcrumb-toggle');
          if (dropdown && toggleLink) {
            if (!dropdown.contains(event.target as Node) && !toggleLink.contains(event.target as Node)) {
              dropdown.style.display = 'none';
            }
          }
        });
      };

      // Delay the overflow check to ensure the container is fully rendered
      setTimeout(checkOverflow, 0);

    } else {
      console.error("Page title section not found.");
    }
  }
}
