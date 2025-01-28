import {
  AtomicBreadbox,
  AtomicColorFacet,
  AtomicDidYouMean,
  AtomicFacet,
  AtomicFacetManager,
  AtomicFormatCurrency,
  AtomicLayoutSection,
  AtomicLoadMoreResults,
  AtomicNoResults,
  AtomicNumericFacet,
  AtomicNumericRange,
  AtomicQueryError,
  AtomicQuerySummary,
  AtomicRatingFacet,
  AtomicRatingRangeFacet,
  AtomicRefineToggle,
  AtomicSearchBox,
  AtomicSearchInterface,
  AtomicSearchLayout,
  AtomicSortDropdown,
  AtomicSortExpression,
  AtomicTimeframe,
  AtomicTimeframeFacet,
  AtomicSearchBoxInstantResults,
  AtomicSearchBoxRecentQueries,
  AtomicResultSectionVisual,
  AtomicResultImage,
  AtomicResultSectionTitle,
  AtomicResultLink,
  AtomicResultSectionTitleMetadata,
  AtomicResultRating,
  AtomicResultNumber,
  Bindings,
  AtomicSearchBoxQuerySuggestions,
  AtomicResultList,
  AtomicResultSectionExcerpt,
  AtomicResultText,
  AtomicQuickview,
  AtomicResultSectionBottomMetadata,
  AtomicFormatUnit,
  AtomicText,
  AtomicResultFieldsList,
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
} from "@coveo/atomic-react";
import {
  buildSearchEngine,
  Result,
  SearchEngineConfiguration,
  getSampleSearchEngineConfiguration,
  loadAdvancedSearchQueryActions,
  FoldedResult,
} from "@coveo/headless";
import React, { FunctionComponent, useMemo } from "react";

type Options = {
  instantResults?: boolean;
  recentQueries?: boolean;
  advancedQuery?: string;
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

export const AtomicPageWrapper: FunctionComponent<Props> = ({
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
   .tab-section atomic-tab-manager::part(tab-area) {
          margin-top: 25px;
        }
  `}
      </style>

      <AtomicSearchInterface
        engine={engine}
        fieldsToInclude={["he_zoominpageversion", "documenttype", "sourcetype"]}
        localization={(i18n) => {
          i18n.addResourceBundle("en", "translation", {
            "no-ratings-available": "No ratings available",
          });
        }}
      >
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
            <div className="tabs-section">
              <AtomicTabManager>
                <AtomicTab label="All Results" name="all" />
                <AtomicTab
                  expression="@source==Zoomin_Publications_QA"
                  label="Zoomin"
                  name="Zoomin"
                />
                <AtomicTab
                  expression="@source==Sanity.io_QA"
                  label="Sanity"
                  name="Sanity"
                />
                <AtomicTab
                  expression="@source==Verint-Community-QA"
                  label="Verint"
                  name="Verint"
                />
              </AtomicTabManager>
            </div>
          </AtomicLayoutSection>

          <AtomicLayoutSection section="facets">
            <AtomicFacetManager>
              <AtomicFacet field="source" label="Source" />
              <AtomicFacet field="objecttype" label="Type" />
              <AtomicFacet field="filetype" label="filetype" />

              <AtomicFacet field="he_zoominpageversion" label="Version" />
              <AtomicFacet field="documenttype" label="DocumentType" />

              <AtomicTimeframeFacet withDatePicker label="Listed within">
                <AtomicTimeframe unit="hour" />
                <AtomicTimeframe unit="day" />
                <AtomicTimeframe unit="week" />
                <AtomicTimeframe unit="month" />
                <AtomicTimeframe unit="quarter" />
                <AtomicTimeframe unit="year" />
                <AtomicTimeframe unit="year" amount={10} period="next" />
              </AtomicTimeframeFacet>
            </AtomicFacetManager>
          </AtomicLayoutSection>

          <AtomicLayoutSection section="main">
            <AtomicLayoutSection section="status">
              <AtomicBreadbox />
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
              <AtomicLoadMoreResults />
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
    .sourcebadge::part(result-badge-element) {
      background-color: rgb(0, 80, 114); /* Your desired color */
      color: white;
    }
      .filetypebadge::part(result-badge-element) {
       background-color: rgb(80, 158, 47);
             color: white;

      }
             atomic-result-link {
                 font-weight: 800;
             }
                 atomic-quickview{
                    margin-left: 530px;               
                          }
                    atomic-result-section-title {
                    display: flex;
                    justify-content: space-between;
                    }
                    .date{
                        font-size: medium;
                            font-weight: 500; 
                    }
                           
  `}
      </style>

      <AtomicResultSectionBadges>
        <AtomicResultBadge
          field="source"
          className="sourcebadge"
        ></AtomicResultBadge>
        <AtomicResultBadge
          field="filetype"
          className="filetypebadge"
        ></AtomicResultBadge>
      </AtomicResultSectionBadges>
      <AtomicQuickview />
      <AtomicResultSectionVisual>
        <div
          dangerouslySetInnerHTML={{
            __html: `
        <atomic-field-condition must-match-source="Verint Community QA">
         <img
          loading="lazy"
          src="https://cdn.sanity.io/images/eqlh3dcx/production/7803fd893badd45e7325736b06e0e74f71677754-1024x1024.svg"
          className="thumbnail"
          alt="Thumbnail"
        />
        </atomic-field-condition>
      `,
          }}
        ></div>
        <div
          dangerouslySetInnerHTML={{
            __html: `
        <atomic-field-condition must-match-source="Zoomin Publications QA">
         <img
          loading="lazy"
          src="https://cdn.sanity.io/images/eqlh3dcx/production/09b5e379cd11fc28445b7d5785220c3e1bead05a-128x128.png"
          className="thumbnail"
          alt="Thumbnail"
        />
        </atomic-field-condition>
      `,
          }}
        ></div>
        <div
          dangerouslySetInnerHTML={{
            __html: `
        <atomic-field-condition must-match-source="Sanity.io_QA">
         <img
          loading="lazy"
          src="https://cdn.sanity.io/images/eqlh3dcx/production/0672c04e997251b3d316e3cb81e5c0be0eaaf5ad-1024x1024.svg"
          className="thumbnail"
          alt="Thumbnail"
        />
        </atomic-field-condition>
      `,
          }}
        ></div>
      </AtomicResultSectionVisual>

      <AtomicResultSectionTitle>
        <AtomicResultLink />
        <span className="date">
          Date: <AtomicResultDate />
        </span>
      </AtomicResultSectionTitle>

      <AtomicResultSectionExcerpt>
        <AtomicResultText field="excerpt" />
      </AtomicResultSectionExcerpt>
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
          <AtomicResultChildren>
            <AtomicResultChildrenTemplate>
              <template
                dangerouslySetInnerHTML={{
                  __html: `
                     <atomic-result-section-visual>
                            <atomic-result-image
                              class="icon"
                            ></atomic-result-image>
                            <img
                              src="https://cdn.sanity.io/images/eqlh3dcx/production/7803fd893badd45e7325736b06e0e74f71677754-1024x1024.svg"
                              class="thumbnail"
                            />
                          </atomic-result-section-visual>
                          <atomic-result-section-title class="child_result">
                            <atomic-result-link></atomic-result-link>
                          
                          </atomic-result-section-title>
                          <atomic-result-section-excerpt>
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

      <AtomicResultSectionBottomMetadata>
        <AtomicResultPrintableUri />
      </AtomicResultSectionBottomMetadata>
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

export default AtomicPageWrapper;
