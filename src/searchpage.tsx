import {
  AtomicBreadbox,
  AtomicDidYouMean,
  AtomicFacet,
  AtomicFacetManager,
  AtomicFormatCurrency,
  AtomicLayoutSection,
  AtomicNoResults,
  AtomicQueryError,
  AtomicQuerySummary,
  AtomicRefineToggle,
  AtomicSearchBox,
  AtomicSearchInterface,
  AtomicSearchLayout,
  AtomicSortDropdown,
  AtomicSortExpression,
  AtomicSearchBoxInstantResults,
  AtomicSearchBoxRecentQueries,
  AtomicResultSectionVisual,
  AtomicResultImage,
  AtomicResultSectionTitle,
  AtomicResultLink,
  AtomicResultSectionTitleMetadata,
  AtomicResultRating,
  AtomicResultNumber,
  AtomicSearchBoxQuerySuggestions,
  AtomicResultSectionExcerpt,
  AtomicResultText,
  AtomicQuickview,
  AtomicResultSectionBottomMetadata,
  AtomicFoldedResultList,
  AtomicResultSectionChildren,
  AtomicResultChildren,
  AtomicResultChildrenTemplate,
  AtomicTab,
  AtomicTabManager,
  AtomicResultBadge,
  AtomicResultSectionBadges,
  AtomicResultPrintableUri,
  AtomicResultDate,
  AtomicResultsPerPage,
  AtomicPager,
  AtomicResultFieldsList,
} from "@coveo/atomic-react";
import {
  buildSearchEngine,
  SearchEngineConfiguration,
  loadAdvancedSearchQueryActions,
  FoldedResult,
  SearchEngine,
} from "@coveo/headless";
import React, { FunctionComponent, useEffect, useMemo, useRef } from "react";

type Options = {
  instantResults?: boolean;
  recentQueries?: boolean;
  advancedQuery?: string;
};
type VerintTemplateProps = {
  result: FoldedResult;
  engine: SearchEngine; // Pass the engine as a prop
};
type Props = {
  options?: Options;
  accessToken: string; // Add accessToken prop
  organizationId: string; // Add organizationId prop
  pipeline: string; // Add pipeline prop
  searchHub: string; // Add searchHub prop
};

// Adding the Coveo assets for styling
const addCoveoAssets = () => {
  const link: HTMLLinkElement = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://static.cloud.coveo.com/atomic/v3.2.3/themes/coveo.css";
  document.head.append(link);
};
addCoveoAssets();

function getSearchpageConfiguration(
  accessToken: string,
  organizationId: string,
  pipeline: string,
  searchHub: string
): SearchEngineConfiguration {
  return {
    accessToken,
    organizationId,
    search: { pipeline, searchHub },
  };
}

const AtomicSearchPageWrapper: FunctionComponent<Props> = ({
  options = {},
  accessToken,
  organizationId,
  pipeline,
  searchHub,
}) => {
  const engine = useMemo(
    () =>
      buildSearchEngine({
        configuration: {
          ...getSearchpageConfiguration(
            accessToken,
            organizationId,
            pipeline,
            searchHub
          ),
          analytics: {
            analyticsMode: "legacy",
          },
        },
      }),
    [accessToken, organizationId, pipeline, searchHub] // Rebuild engine if any of these change
  );

  // Update advanced search query if provided
  if (options.advancedQuery) {
    const action = loadAdvancedSearchQueryActions(
      engine
    ).updateAdvancedSearchQueries({
      aq: options.advancedQuery,
    });
    engine.dispatch(action);
  }
  return (
    <>
      <style>
        {`
          :root {
            --primary-color: #005072;
            --hover-color: #509E2F;
            --border-radius: 30px;
            --tab-active-color: red;
            --tab-active-bg: yellow;
            --body-font-color: #121212;
            --body-font-family: "Open Sans", serif;
          `}
      </style>
      <AtomicSearchInterface
        engine={engine}
        fieldsToInclude={[
          "he_zoominpageversion",
          "documenttype",
          "sourcetype",
          "he_mappingproductlist",
          "he_zoominformat",
          "he_zoomindocumenttype",
          "he_sanityproducttype",
          "he_sanityhardwaretype",
          "he_sanitysoftwaretype",
          "he_sanityarea",
          "he_autorname",
          "he_zoominaccess",
          "he_sanitycategory",
          "he_verint_filetype",
          "he_sanitybody",
        ]}
        localization={(i18n) => {
          i18n.addResourceBundle("en", "translation", {
            "no-ratings-available": "No ratings available",
          });
          console.log(engine);
        }}
      >
        <style>
          {`
        atomic-tab-manager::part(button-container)  {
          display: flex;
          border: 1px solid var(--primary-color);
          border-radius: 30px;       
          }
          
          atomic-tab-manager::part(button-container):hover{
          background-color: #509E2F
             
          }
          atomic-tab-manager::part(tab-button){
          color: var(--primary-color);
          padding: 5px 12px;
          font-size: 14px;
          font-weight: 400;
          line-height: 24px;
          text-align: center;

          }
         
          atomic-tab-manager::part(tab-button):hover{
          color: white;
          }
          atomic-tab-manager::part(button-container):after {
               background-color: #509E2F;
                border-radius: 30px;
                height: 34px;
                top: 0px;
                position: absolute;
                z-index: -9;  
                  }
             atomic-tab-manager::part(tab-area) atomic-tab-button[aria-current="true"]::part(button) {
              color: red !important;
              background-color: yellow !important;
              font-weight: bold !important;
            }







       atomic-tab-manager::part(tab-area){
                 border-bottom:none;
                 display: flex;
                  gap: 8px;
                }
                 

                        
    `}
        </style>
        <AtomicSearchLayout>
          <AtomicLayoutSection section="search">
            <AtomicSearchBox>
              <AtomicSearchBoxQuerySuggestions />
              {options.recentQueries && <AtomicSearchBoxRecentQueries />}
              {options.instantResults && (
                <AtomicSearchBoxInstantResults
                  template={InstantResultsTemplate}
                  imageSize="small"
                />
              )}
            </AtomicSearchBox>
            <div className="tabs-section" style={{ marginTop: "14px" }}>
              <AtomicTabManager>
                <AtomicTab label="All Results" name="all" />

                <AtomicTab
                  expression="@source==Zoomin_Publications_QA"
                  label="Documentation"
                  name="Documentation"
                />
                <AtomicTab
                  expression="@source==Verint-Community-QA"
                  label="Community"
                  name="Community"
                />
                <AtomicTab
                  expression="@source==Sanity.io_QA"
                  label="Products"
                  name="Products"
                />
              </AtomicTabManager>
            </div>
          </AtomicLayoutSection>
          <AtomicLayoutSection section="facets">
            <style>
              {`
              atomic-breadbox::part(container),
              atomic-facet-manager atomic-facet::part(facet), 
              atomic-facet-manager atomic-timeframe-facet::part(facet), 
              atomic-facet-manager atomic-category-facet::part(facet) {
                background-color: transparent;
                border: 1px solid #DCDDDD;
                margin-bottom: 16px;
                padding: 16px;
                border-radius: 8px;
                position: relative;
            }
            atomic-facet-manager atomic-facet::part(label-button), 
            atomic-facet-manager atomic-facet::part(value-checkbox-label), 
            atomic-facet-manager atomic-timeframe-facet::part(label-button), 
            atomic-facet-manager atomic-category-facet::part(label-button), 
            atomic-facet-manager atomic-category-facet::part(value-link), 
            atomic-facet-manager atomic-timeframe-facet::part(value-link) {
              padding: 6px 10px;
              color: var(--body-font-color);
              font-family: var(--body-font-family);
              font-weight: 700;
              line-height: 16px;
              font-size: 14px;
          }
          atomic-facet::part(value-checkbox) {
              border: 2px solid var(--primary-color);
              border-radius: 3px;
              width: 18px;
              height: 18px;
              box-sizing: inherit;
              left: 10px;
          }
              atomic-facet::part(search-input), atomic-timeframe-facet::part(search-input), atomic-category-facet::part(search-input) {
              padding: 8px 16px 8px 30px;
              font-size: 14px;
              color: var(--body-font-color);
              font-family: var(--body-font-family);
              font-weight: 400;
              height: 32px;
              border-radius: 4px;
              width: 100%;
              border:none;
              background:#f1f1f1;
          }
              atomic-facet-manager atomic-facet::part(show-more), atomic-facet-manager atomic-category-facet::part(show-more), atomic-facet-manager atomic-facet::part(show-less), atomic-facet-manager atomic-category-facet::part(show-less) {
                color: var(--primary-color);
                font-family: var(--body-font-family);
                font-size:13px;
            }
              atomic-facet::part(clear-button), 
              atomic-category-facet::part(clear-button), 
              atomic-timeframe-facet::part(clear-button) {
              position: absolute;
              z-index: 99;
              top: 12px;
              right: 42px;
              background-color: transparent;
              color: var(--body-font-color);
              font-size: 13px;
          }
          atomic-facet::part(value-checkbox-checked) {
            background-color: var(--primary-color);
          }
          atomic-facet-manager atomic-facet::part(value-label) {
              padding-left: 28px;
              color: var(--body-font-color);
              font-family: var(--body-font-family);
              font-weight: 400;
          }
              atomic-breadbox::part(clear),
              atomic-breadbox::part(show-more) {
              color: var( --primary-color);
              font-family: var(--body-font-family);
              font-weight: 400;
              }
              `}
            </style>
            <AtomicFacetManager>
              <AtomicBreadbox />

              <AtomicFacet field="Source" label="Source" />
              <AtomicFacet field="Filetype" label="FileType" />
              <AtomicFacet field="he_zoominformat" label="Format" />
              <AtomicFacet field="he_mappingproductlist" label="ProductName" />
              <AtomicFacet field="he_sanitycategory" label="ProductType" />
              <AtomicFacet field="he_sanityhardwaretype" label="HardwareType" />
              <AtomicFacet field="he_sanitysoftwaretype" label="SoftwareType" />
              <AtomicFacet field="he_autorname" label="AuthorName" />
              <AtomicFacet field="he_verint_filetype" label="ContentType" />
              <AtomicFacet
                field="he_sanityarea"
                label="ProductArea"
              ></AtomicFacet>
              <AtomicFacet field="he_zoominaccess" label="Access" />
              <AtomicFacet field="he_zoomindocumenttype" label="DocumentType" />
            </AtomicFacetManager>
          </AtomicLayoutSection>

          <AtomicLayoutSection section="main">
            <style>
              {`
              atomic-query-summary::part(container) {
                font-family: var(--body-font-family);
                font-size: 14px;
                font-weight: 700;
                line-height: 24px;
                color: var(--body-font-color)
              }
              atomic-sort-dropdown::part(select) {
                border: 1px solid #DCDDDD;
              }
              `}
            </style>
            <AtomicLayoutSection section="status">
              {/* <AtomicBreadbox /> */}

              <AtomicQuerySummary />
              <AtomicRefineToggle />
              <AtomicSortDropdown>
                <AtomicSortExpression
                  label="relevance"
                  expression="relevancy"
                />
                <AtomicSortExpression
                  label="Newest"
                  expression="date ascending"
                />
                <AtomicSortExpression
                  label="Oldest"
                  expression="date descending"
                />
              </AtomicSortDropdown>
              <AtomicDidYouMean />
            </AtomicLayoutSection>

            <AtomicLayoutSection section="results">
              <AtomicQueryError />
              <AtomicNoResults />

              <AtomicFoldedResultList
                template={VerintTemplate}
                numberOfFoldedResults={1}
                parentField="he_foldingparent"
                childField="he_foldingchild"
                collectionField="he_foldingcollection"
              />
            </AtomicLayoutSection>

            <AtomicLayoutSection section="pagination">
              <style>
                {`<style>
                            .pagination {
                                margin-top: 50px;
                                border-top: 1px solid #ebe9e9;
                            }

                            atomic-pager::part(page-button),
                            atomic-results-per-page::part(button) {
                                color: var(--body-font-color);
                                background-color: transparent;
                                border: none;
                                font-weight: 400;
                                font-size: 14px;
                                line-height: 20px;
                                cursor: pointer;
                                min-width: unset;
                                min-height: unset;
                                padding: 4px 10px;
                                width: unset;
                                border-radius: 50%;
                                height: unset;
                            }

                            atomic-pager::part(previous-button),
                            atomic-pager::part(next-button) {
                                cursor: pointer;
                                min-width: unset;
                                min-height: unset;
                                padding: 4px 10px;
                                border: none;
                                color: var(--body-font-color);
                            }

                            atomic-pager::part(buttons),
                            atomic-results-per-page::part(buttons) {
                                display: flex;
                                align-items: center;
                                gap: 6px;
                            }
                            atomic-pager::part(next-button-icon),
                            atomic-pager::part(previous-button-icon) {
                                fill: var(--body-font-color);
                            }
                            atomic-pager::part(previous-button):disabled, 
                            atomic-pager::part(next-button):disabled {
                              fill: gray; 
                              opacity: 0.5; 
                            }

                            atomic-pager::part(active-page-button),
                            atomic-pager::part(page-button):hover,
                            atomic-results-per-page::part(active-button),
                            atomic-results-per-page::part(button):hover,
                            atomic-pager::part(page-button):hover {
                                color: white;
                                background-color: var(--primary-color);
                                border: none;
                            }
                        </style>`}
              </style>
              <AtomicPager />
              <AtomicResultsPerPage
                data-atomic-rendered="false"
                data-atomic-loaded="false"
                class="atomic-hidden hydrated"
                choices-displayed="10,25,50,100"
              />
            </AtomicLayoutSection>
          </AtomicLayoutSection>
        </AtomicSearchLayout>
      </AtomicSearchInterface>
    </>
  );
};

// Template for Instant Results

function VerintTemplate(result: FoldedResult): JSX.Element {
  console.log("results=", result);

  return (
    <>
      <style>
        {`
      
               atomic-result-link {
                   font-weight: 800;
               }
                  
                      atomic-result-section-title {
                        display: flex;
                        justify-content: space-between;
                      }
                      atomic-result-section-title atomic-result-text {
                        color: var( --body-font-color);
                        font-family: var(--body-font-family);
                        font-size: 18px;
                        font-weight: 600;
                        line-height: 24px;

                      }
                         .resultDateBlock {
                          color: #545559;
                          font-family: var(--body-font-family);
                          font-size: 14px;
                          font-weight: 400;
                          line-height: 24px;
                          width: 100%;
                          max-width: 160px;
                          display: flex;
                          justify-content: flex-end;
                          gap: 4px;
                      }
                      atomic-result-section-excerpt {
                            margin-top:16px !important;
                            max-height: unset !important;
                          }
                            atomic-result-section-excerpt atomic-result-text {
                              font-size: 14px;
                              font-weight: 400;
                              line-height: 24px;
                              color: var( --body-font-color);
                              display: -webkit-box;
                              -webkit-line-clamp: 2;
                              -webkit-box-orient: vertical;

                            }
                      
                     
                             atomic-result-section-bottom-metadata {
                                display:flex;
                                gap:4px;
                                align-items:center;
                                margin-top:16px !important;
                              }
                                atomic-result-section-bottom-metadata atomic-field-condition,
                                atomic-result-section-bottom-metadata atomic-result-text  {
                                color: #545559;
                                font-size: 14px;
                                font-weight: 400;
                                line-height: 24px;
                                }
                                atomic-quickview {
                                 width:20px;
                                  height:20px;
                                }
                             atomic-quickview::part(button){
                                border:none;
                                padding:0;
                                width:20px;
                                height:20px;
                                color:#545559;
                             } 
                              atomic-result-children::part(children-root) {
                                border: none !important;
                                border-left: 1px solid #0000001F !important;
                                border-radius: unset !important;

                              }

                            
    `}
      </style>

      {/* <AtomicResultSectionBadges>
        <AtomicResultBadge
          field="source"
          className="sourcebadge"
        ></AtomicResultBadge>
        <AtomicResultBadge
          field="filetype"
          className="filetypebadge"
        ></AtomicResultBadge>
      </AtomicResultSectionBadges> */}
      <AtomicResultSectionVisual>
        {/* Conditional rendering for Verint Community QA */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
      <atomic-field-condition must-match-he_verint_filetype="Discussions">
        <img
          loading="lazy"
          src="/assets/Communitydiscussions.svg"
          class="thumbnail"
          alt="Thumbnail"
        />
      </atomic-field-condition>
      `,
          }}
        ></div>
        <div
          dangerouslySetInnerHTML={{
            __html: `
      <atomic-field-condition must-match-he_verint_filetype="Product News">
        <img
          loading="lazy"
          src="/assets/Productnews.svg"
          class="thumbnail"
          alt="Thumbnail"
        />
      </atomic-field-condition>
      `,
          }}
        ></div>
        <div
          dangerouslySetInnerHTML={{
            __html: `
      <atomic-field-condition must-match-he_verint_filetype="Articles">
        <img
          loading="lazy"
          src="/assets/Articles.svg"
          class="thumbnail"
          alt="Thumbnail"
        />
      </atomic-field-condition>
      `,
          }}
        ></div>
        {/* Atomic Field Condition for Zoomin Publications QA */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
      <atomic-field-condition must-match-source="Zoomin Publications QA">
        <img
          loading="lazy"
          src="/assets/PdfIcon.svg"
          class="thumbnail"
          alt="Thumbnail"
        />
      </atomic-field-condition>
      `,
          }}
        ></div>
        <div
          dangerouslySetInnerHTML={{
            __html: `
      <atomic-field-condition must-not-match-he_verint_filetype="Articles,Discussions,Product News">
        <img
          loading="lazy"
          src="	https://cdn.sanity.io/images/eqlh3dcx/qa/44bed1ed700e975b6d0bfc130c8c6c91f6721be8-1024x1024.png"
          class="thumbnail"
          alt="Thumbnail"
        />
      </atomic-field-condition>
      `,
          }}
        ></div>
        {/* Atomic Field Condition for Sanity.io_QA */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
      <atomic-field-condition must-match-source="Sanity.io_QA">
        <img
          loading="lazy"
          src="https://cdn.sanity.io/images/eqlh3dcx/production/09b5e379cd11fc28445b7d5785220c3e1bead05a-128x128.png"
          class="thumbnail"
          alt="Thumbnail"
        />
      </atomic-field-condition>
      `,
          }}
        ></div>
      </AtomicResultSectionVisual>

      <AtomicResultSectionTitle>
        <AtomicResultLink />
        <span className="resultDateBlock">
          Date: <AtomicResultDate />
        </span>
      </AtomicResultSectionTitle>

      <AtomicResultSectionExcerpt>
        <AtomicResultText field="excerpt" />
      </AtomicResultSectionExcerpt>
      <AtomicResultSectionBottomMetadata>
        {/* <AtomicResultFieldsList> */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <atomic-field-condition must-match-source="Sanity.io_QA">
          Products
          <span>.</span>
          </atomic-field-condition>
        `,
          }}
        ></div>
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <atomic-field-condition must-match-source="Zoomin Publications QA">
          Documentation
          </atomic-field-condition>
        `,
          }}
        ></div>
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <atomic-field-condition must-match-source="Verint Community QA">
          Community
          <span>.</span>
          </atomic-field-condition>
        `,
          }}
        ></div>

        <AtomicResultText field={"he_verint_filetype"}></AtomicResultText>
        <div
          dangerouslySetInnerHTML={{
            __html: `
          <atomic-field-condition if-defined="he_verint_filetype">
         <span>.</span>
          </atomic-field-condition>
        `,
          }}
        ></div>
        <AtomicQuickview />
        {/* </AtomicResultFieldsList> */}
      </AtomicResultSectionBottomMetadata>
      {result.children.length <= 1 && (
        <style>
          {`
        atomic-result-children::part(show-hide-button) {
          display: none;
        }
      `}
        </style>
      )}
      {result.children.length !== 0 && (
        <AtomicResultSectionChildren>
          <style>
            {`
       
          .child_result {
            color: var(--body-font-color);
            font-family: var(--body-font-family);
            font-size: 18px;
            font-weight: 600;
            line-height: 24px;
        }
      `}
          </style>
          <AtomicResultChildren>
            <AtomicResultChildrenTemplate>
              <template
                dangerouslySetInnerHTML={{
                  __html: `
                       <atomic-result-section-visual>
                              <atomic-field-condition must-match-he_verint_filetype="Discussions">
                                <img
                                  loading="lazy"
                                  src="/assets/Communitydiscussions.svg"
                                  class="thumbnail"
                                  alt="Thumbnail"
                                />
                              </atomic-field-condition>
                               <atomic-field-condition must-match-he_verint_filetype="Product News">
                                  <img
                                    loading="lazy"
                                    src="/assets/Productnews.svg"
                                    class="thumbnail"
                                    alt="Thumbnail"
                                  />
                                </atomic-field-condition>
                                 <atomic-field-condition must-match-he_verint_filetype="Articles">
                                    <img
                                      loading="lazy"
                                      src="/assets/Articles.svg"
                                      class="thumbnail"
                                      alt="Thumbnail"
                                    />
                                  </atomic-field-condition>
                            </atomic-result-section-visual>
                            <atomic-result-section-title class="child_result" style="color: var(--body-font-color);font-family: var(--body-font-family);font-size: 18px;font-weight: 600;line-height: 24px;">
                              <atomic-result-link></atomic-result-link>
                            
                            </atomic-result-section-title>
                            <atomic-result-section-excerpt style="font-size: 14px;font-weight: 400;line-height: 24px;color: var(--body-font-color);display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical; max-height: unset;">
                              <atomic-result-text
                                field="excerpt"
                              ></atomic-result-text>
                            </atomic-result-section-excerpt>
      `,
                }}
              ></template>
            </AtomicResultChildrenTemplate>
          </AtomicResultChildren>
        </AtomicResultSectionChildren>
      )}
    </>
  );
}

function InstantResultsTemplate() {
  return (
    <>
      <style>{".result-root{padding: 14px;}"}</style>
      <AtomicResultSectionVisual>
        <AtomicResultImage field="ec_images" />
      </AtomicResultSectionVisual>
      <AtomicResultSectionTitle>
        <AtomicResultLink />
      </AtomicResultSectionTitle>
      <AtomicResultSectionTitleMetadata>
        <AtomicResultRating field="ec_rating" />
        <AtomicResultNumber field="ec_price">
          <AtomicFormatCurrency currency="USD" />
        </AtomicResultNumber>
      </AtomicResultSectionTitleMetadata>
    </>
  );
}

export default AtomicSearchPageWrapper;