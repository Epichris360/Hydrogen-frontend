export const postFavoriteProduct = (backendUrl, id, func) => {
  return async () => {
    try {
      const response = await fetch(`${backendUrl}/api/favorites?id=${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      await response.json();

      if (func) func();
    } catch (e) {
      throw new Error(e.message);
    }
  };
};

export const getFavoriteProductById = (backendUrl, id) => {
  return async () => {
    try {
      const response = await fetch(`${backendUrl}/api/favorites?id=${id}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      const data = await response.json();
      return data.isFavorite;
    } catch (e) {
      throw new Error(e.message);
    }
  };
};

export const deleteFavoriteProductById = (backendUrl, id, func) => {
  return async () => {
    try {
      await fetch(`${backendUrl}/api/favorites?id=${id}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (func) func();

      return;
    } catch (e) {
      throw new Error(e.message);
    }
  };
};

export const getAllFavoriteProducts = async (backendUrl) => {
  try {
    const response = await fetch(`${backendUrl}/api/favorites`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

    const data = await response.json();
    return data;
  } catch (e) {
    throw new Error(e.message);
  }
};
