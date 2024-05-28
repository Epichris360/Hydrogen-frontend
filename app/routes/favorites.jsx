import {useLoaderData, Link} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import {Pagination, Image} from '@shopify/hydrogen';
import {getAllFavoriteProducts} from '~/backend';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context, request}) {
  const favorites = await getAllFavoriteProducts(context.env.BACKEND_URL);
  const favsIds = favorites.map((f) => {
    const split = f.productId.split('/');
    const id = split[split.length - 1];
    return `(id:${id})`;
  });
  const favsQuery = favsIds.join(' OR ');
  let collections = [];
  if (favsQuery) {
    const {products} = await context.storefront.query(COLLECTIONS_QUERY, {
      variables: {
        query: favsQuery,
      },
    });
    collections = products;
  }

  return json({collections});
}

export default function Collections() {
  /** @type {LoaderReturnData} */
  const {collections} = useLoaderData();

  if (!collections?.nodes?.length) {
    return <h1>No Favorites At This Time</h1>;
  }

  return (
    <div className="collections">
      <h1>Collections</h1>
      <Pagination connection={collections}>
        {({nodes, isLoading, PreviousLink, NextLink}) => (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            <CollectionsGrid collections={nodes} />
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </div>
        )}
      </Pagination>
    </div>
  );
}

/**
 * @param {{collections: CollectionFragment[]}}
 */
function CollectionsGrid({collections}) {
  return (
    <div className="collections-grid">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

/**
 * @param {{
 *   collection: CollectionFragment;
 *   index: number;
 * }}
 */
function CollectionItem({collection, index}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/products/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.featuredImage && (
        <Image
          alt={collection.featuredImage.altText || collection.title}
          aspectRatio="1/1"
          data={collection.featuredImage}
          loading={index < 3 ? 'eager' : undefined}
        />
      )}
      <h5>{collection.title}</h5>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
query getProductById($query:String) {
    products(first: 20, query: $query){
      nodes {
        description
        id
        featuredImage {
          url
          altText
        }
        handle
        title
        options {
          name
          values
        }
        requiresSellingPlan
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('storefrontapi.generated').CollectionFragment} CollectionFragment */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
