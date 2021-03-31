/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocPaginator from '@theme/DocPaginator';
import DocVersionSuggestions from '@theme/DocVersionSuggestions';
import TOC from '@theme/TOC';
import classnames from 'classnames';
import clsx from 'clsx';
import styles from './styles.module.css';
import { useActivePlugin, useVersions, useActiveVersion } from '@theme/hooks/useDocs';

function APIDocItem(props) {
  const { siteConfig = {} } = useDocusaurusContext();
  const { url: siteUrl, title: siteTitle, titleDelimiter } = siteConfig;
  const { content: DocContent } = props;
  const { metadata } = DocContent;
  const { description, title, permalink, editUrl, lastUpdatedAt, lastUpdatedBy, source } = metadata;
  const {
    frontMatter: { image: metaImage, keywords, hide_title: hideTitle, hide_table_of_contents: hideTableOfContents },
  } = DocContent;
  const issueTitle = `Issue with "${title}" in ${source}`;
  const issueUrl = `https://github.com/PaloAltoNetworks/prisma.pan.dev/issues/new?labels=documentation&template=developer-documentation-issue.md&title=${issueTitle}`;
  const { pluginId } = useActivePlugin({
    failfast: true,
  });
  const versions = useVersions(pluginId);
  const version = useActiveVersion(pluginId); // If site is not versioned or only one version is included
  // we don't show the version badge
  // See https://github.com/facebook/docusaurus/issues/3362

  const showVersionBadge = versions.length > 1;
  const metaTitle = title ? `${title} ${titleDelimiter} ${siteTitle}` : siteTitle;
  const metaImageUrl = useBaseUrl(metaImage, {
    absolute: true,
  });
  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta property="og:title" content={metaTitle} />
        {description && <meta name="description" content={description} />}
        {description && <meta property="og:description" content={description} />}
        {keywords && keywords.length && <meta name="keywords" content={keywords.join(',')} />}
        {metaImage && <meta property="og:image" content={metaImageUrl} />}
        {metaImage && <meta property="twitter:image" content={metaImageUrl} />}
        {metaImage && <meta name="twitter:image:alt" content={`Image for ${title}`} />}
        {permalink && <meta property="og:url" content={siteUrl + permalink} />}
        {permalink && <link rel="canonical" href={siteUrl + permalink} />}
      </Head>
      <div className={clsx('container padding-vert--lg', styles.docItemWrapper)}>
        <div className="row">
          <div
            className={clsx('col', {
              [styles.docItemCol]: !hideTableOfContents,
            })}
          >
            <DocVersionSuggestions />
            <div className={styles.docItemContainer}>
              <article>
                {showVersionBadge && (
                  <div>
                    <span className="badge badge--secondary">Version: {version.label}</span>
                  </div>
                )}
                {!hideTitle && (
                  <header>
                    <h1 className={styles.docTitle}>{title}</h1>
                  </header>
                )}
                <div className="markdown">
                  <DocContent />
                </div>
              </article>
              {(editUrl || lastUpdatedAt || lastUpdatedBy) && (
                <div className="margin-vert--xl">
                  <div className="row">
                    {(lastUpdatedAt || lastUpdatedBy) && (
                      <div className="col text--right">
                        <em>
                          <small>
                            Last updated{' '}
                            {lastUpdatedAt && (
                              <>
                                on{' '}
                                <time
                                  dateTime={new Date(lastUpdatedAt * 1000).toISOString()}
                                  className={styles.docLastUpdatedAt}
                                >
                                  {new Date(lastUpdatedAt * 1000).toLocaleDateString()}
                                </time>
                                {lastUpdatedBy && ' '}
                              </>
                            )}
                            {lastUpdatedBy && (
                              <>
                                by <strong>{lastUpdatedBy}</strong>
                              </>
                            )}
                            {process.env.NODE_ENV === 'development' && (
                              <div>
                                <small> (Simulated during dev for better perf)</small>
                              </div>
                            )}
                          </small>
                        </em>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col text--right">
                      <Link
                        className={classnames('button button--outline button--primary button--md')}
                        href={issueUrl}
                        target="_blank"
                      >
                        Report an Issue
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              <div className="margin-vert--lg">
                <DocPaginator metadata={metadata} />
              </div>
            </div>
          </div>
          {!hideTableOfContents && DocContent.rightToc && (
            <div className="col col--3">
              <TOC headings={DocContent.rightToc} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default APIDocItem;