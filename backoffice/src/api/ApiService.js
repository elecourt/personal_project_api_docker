import AxiosInstance from "./AxiosInstance";

class ApiService {
  async getLoggedUser() {
    const { data } = await AxiosInstance.get(`/users/@me`);
    return data;
  }

  async getRestaurantAccounts() {
    const { data } = await AxiosInstance.get(`/restaurants`);
    return data;
  }

  async createRestaurantUser(restaurantUser) {
    const { data } = await AxiosInstance.post(`/restaurants`,restaurantUser);
    return data;
  }

  async updateRestaurantUser(restaurantUser) {
    const { data } = await AxiosInstance.put(`/restaurants/`+restaurantUser._id,restaurantUser);
    return data;
  }

  async deleteRestaurant(restaurantId) {
    const { data } = await AxiosInstance.delete(`/restaurants/`+restaurantId);
    return data;
  }

  async getPlate(plateId) {
    const { data } = await AxiosInstance.get(`/dishes/`+plateId);
    return data;
  }

  async updatePlate(plateId, newPlate) {
    const { data } = await AxiosInstance.put(`/dishes/`+plateId,newPlate);
    return data;
  }

  async createPlate(newPlate) {
    const { data } = await AxiosInstance.post(`/dishes/`,newPlate);
    return data;
  }

  async getRestaurantPlates(restaurantId) {
    const { data } = await AxiosInstance.get(`/restaurants/`+ restaurantId+`/dishes`);
    return data;
  }

  async cancelOrder(orderId) {
    const { data } = await AxiosInstance.delete(`/orders/` + orderId);
    return data;
  }

  async getRestaurantOrders(restaurantId) {
    const { data } = await AxiosInstance.get(`/restaurants/`+ restaurantId +`/orders`);
    return data;
  }
}

export default new ApiService();
