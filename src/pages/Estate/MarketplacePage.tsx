import { FormEvent, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { toast } from "react-toastify";
import Header from "../../general/Header";
import Pagination from "../../components/Tables/Pagination";
import { useEstatePaths } from "./estatePaths";
import {
  createMarketplaceProduct,
  deleteMarketplaceProduct,
  EstateOption,
  fetchAdminMarketplaceOrders,
  fetchEstateCommunities,
  fetchMarketplaceProducts,
  MarketOrder,
  MarketProduct,
  OrderStatus,
  orderStatuses,
  updateAdminMarketplaceOrder,
} from "./marketplaceApi";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const statusLabel: Record<OrderStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-sky-50 text-sky-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-600",
};

const categories = ["Groceries", "Household", "Accessories", "Services"];
const pageSize = 12;

export default function MarketplacePage() {
  const navigate = useNavigate();
  const estatePaths = useEstatePaths();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [orderFilter, setOrderFilter] = useState<OrderStatus | "all">("all");
  const [showAdd, setShowAdd] = useState(false);
  const [productPage, setProductPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [products, setProducts] = useState<MarketProduct[]>([]);
  const [orders, setOrders] = useState<MarketOrder[]>([]);
  const [productTotal, setProductTotal] = useState(0);
  const [productPages, setProductPages] = useState(1);
  const [orderPages, setOrderPages] = useState(1);
  const [openOrders, setOpenOrders] = useState(0);
  const [completedSales, setCompletedSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<MarketProduct | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [productList, orderList, pending, processing, completed] =
          await Promise.all([
            fetchMarketplaceProducts(productPage, pageSize),
            fetchAdminMarketplaceOrders({
              page: orderPage,
              perPage: pageSize,
              status: orderFilter === "all" ? undefined : orderFilter,
            }),
            fetchAdminMarketplaceOrders({
              page: 1,
              perPage: 1,
              status: "pending",
            }),
            fetchAdminMarketplaceOrders({
              page: 1,
              perPage: 1,
              status: "processing",
            }),
            fetchAdminMarketplaceOrders({
              page: 1,
              perPage: 100,
              status: "completed",
            }),
          ]);

        if (!active) return;
        setProducts(productList.data);
        setProductTotal(productList.total);
        setProductPages(productList.last_page || 1);
        setOrders(orderList.data);
        setOrderPages(orderList.last_page || 1);
        setOpenOrders(pending.total + processing.total);
        setCompletedSales(
          completed.data.reduce(
            (sum, order) => sum + Number(order.total_price),
            0,
          ),
        );
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load the marketplace",
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [productPage, orderPage, orderFilter, refreshKey]);

  const changeStatus = async (order: MarketOrder, status: OrderStatus) => {
    if (status === order.status) return;
    setUpdatingId(order.id);
    try {
      const result = await updateAdminMarketplaceOrder(order.id, status);
      toast.success(result.message || "Order updated");
      setRefreshKey((value) => value + 1);
    } catch (updateError) {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Could not update order",
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const removeProduct = async () => {
    if (!deleting) return;
    try {
      const result = await deleteMarketplaceProduct(deleting.id);
      toast.success(result.message || "Product deleted");
      setDeleting(null);
      setRefreshKey((value) => value + 1);
    } catch (deleteError) {
      toast.error(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete product",
      );
    }
  };

  return (
    <div className="pb-14">
      <Header
        title="Marketplace"
        subtitle="Add products and monitor orders across estate communities"
        showSearchAndButton={false}
      />

      <div className="mb-6 flex flex-wrap items-center gap-3 px-4 lg:pl-[38px] lg:pr-[68px]">
        <button
          type="button"
          onClick={() => navigate(estatePaths.estates)}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-[#79B833] bg-white px-5 text-sm font-bold text-[#79B833] hover:bg-[#79B833]/10"
        >
          <IoArrowBackSharp />
          Estate Communities
        </button>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="h-11 rounded-full bg-[#272727] px-5 text-sm font-bold text-white"
        >
          Add Product
        </button>
      </div>

      <div className="mb-6 grid gap-4 px-4 sm:grid-cols-3 lg:pl-[38px] lg:pr-[68px]">
        <Summary label="Products" value={String(productTotal)} />
        <Summary label="Open orders" value={String(openOrders)} />
        <Summary
          label="Completed sales"
          value={money.format(completedSales)}
        />
      </div>

      <div className="px-4 lg:pl-[38px] lg:pr-[68px]">
        <div className="mb-5 flex gap-2">
          {(["products", "orders"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`h-10 rounded-full px-5 text-sm font-medium capitalize ${
                tab === item
                  ? "bg-[#79B833] text-white"
                  : "bg-white text-[#767676]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-[24px] bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
            Loading marketplace
          </div>
        ) : tab === "products" ? (
          <>
            {products.length === 0 ? (
              <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
                No products yet. Add the first product for an estate community.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="overflow-hidden rounded-[28px] border border-[#F0F0F0] bg-white shadow-sm"
                  >
                    {product.picture && (
                      <img
                        src={product.picture}
                        alt={product.name}
                        className="h-44 w-full object-cover"
                      />
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-[#888888]">
                            {product.category}
                          </p>
                          <h2 className="mt-1 text-lg font-medium text-[#272727]">
                            {product.name}
                          </h2>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            product.stock > 0
                              ? "bg-[#79B833]/15 text-[#4d7a1f]"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {product.stock > 0 ? "In stock" : "Out of stock"}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-[#767676]">
                        {product.description}
                      </p>
                      <div className="mt-5 flex items-end justify-between">
                        <div>
                          <p className="text-xl font-medium text-[#032147]">
                            {money.format(Number(product.price))}
                          </p>
                          <p className="mt-1 text-xs text-[#888888]">
                            {product.estate?.estate_name || "Estate community"}
                          </p>
                        </div>
                        <p className="text-sm text-[#272727]">
                          {product.stock} left
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDeleting(product)}
                        className="mt-4 text-sm font-medium text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {productPages > 1 && (
              <Pagination
                pagination={{
                  currentPage: productPage,
                  totalPages: productPages,
                }}
                onPageChange={setProductPage}
                className="mt-8"
              />
            )}
          </>
        ) : (
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {(["all", ...orderStatuses] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => {
                    setOrderFilter(status);
                    setOrderPage(1);
                  }}
                  className={`h-9 rounded-full px-4 text-xs font-medium capitalize ${
                    orderFilter === status
                      ? "bg-[#032147] text-white"
                      : "bg-white text-[#767676]"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            {orders.length === 0 ? (
              <div className="rounded-[28px] bg-white px-6 py-16 text-center text-sm text-[#767676]">
                No orders in this status.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => {
                  const customer = order.user
                    ? `${order.user.first_name} ${order.user.last_name}`.trim()
                    : "Resident";
                  return (
                    <article
                      key={order.id}
                      className="grid gap-4 rounded-[28px] bg-white p-5 shadow-sm md:grid-cols-[1.4fr_1fr_auto] md:items-center"
                    >
                      <div>
                        <p className="text-xs text-[#888888]">#{order.id}</p>
                        <h2 className="mt-1 font-medium text-[#272727]">
                          {order.product_name}
                        </h2>
                        <p className="mt-1 text-sm text-[#767676]">
                          {customer} · {order.estate?.estate_name || "Estate"}
                        </p>
                      </div>
                      <div className="text-sm text-[#272727]">
                        <p>
                          Qty {order.quantity} ·{" "}
                          {money.format(Number(order.total_price))}
                        </p>
                        <p className="mt-1 text-xs text-[#888888]">
                          {order.created_at?.slice(0, 10)}
                        </p>
                      </div>
                      <label className="text-xs text-[#888888]">
                        Status
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(event) =>
                            changeStatus(
                              order,
                              event.target.value as OrderStatus,
                            )
                          }
                          className={`mt-1 block h-10 rounded-full px-3 text-sm font-medium capitalize outline-none ${statusStyles[order.status]}`}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel[status]}
                            </option>
                          ))}
                        </select>
                      </label>
                    </article>
                  );
                })}
              </div>
            )}
            {orderPages > 1 && (
              <Pagination
                pagination={{
                  currentPage: orderPage,
                  totalPages: orderPages,
                }}
                onPageChange={setOrderPage}
                className="mt-8"
              />
            )}
          </div>
        )}
      </div>

      {showAdd && (
        <AddProductModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            setProductPage(1);
            setRefreshKey((value) => value + 1);
          }}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6">
            <h2 className="text-xl font-medium text-[#272727]">
              Delete product
            </h2>
            <p className="mt-2 text-sm text-[#767676]">
              Remove {deleting.name} from the marketplace.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="h-11 rounded-full border border-gray-300 px-5 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={removeProduct}
                className="h-11 rounded-full bg-red-600 px-5 text-sm font-bold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-[#888888]">{label}</p>
      <p className="mt-1 text-2xl font-medium text-[#032147]">{value}</p>
    </div>
  );
}

function AddProductModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [estates, setEstates] = useState<EstateOption[]>([]);
  const [loadingEstates, setLoadingEstates] = useState(true);
  const [form, setForm] = useState({
    name: "",
    category: categories[0],
    price: "",
    stock: "",
    estateId: "",
    description: "",
  });
  const [picture, setPicture] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetchEstateCommunities()
      .then((list) => {
        if (!active) return;
        setEstates(list);
        setForm((current) => ({
          ...current,
          estateId: current.estateId || (list[0] ? String(list[0].id) : ""),
        }));
      })
      .catch((loadError) => {
        if (!active) return;
        toast.error(
          loadError instanceof Error
            ? loadError.message
            : "Could not load estate communities",
        );
      })
      .finally(() => {
        if (active) setLoadingEstates(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const update = (name: string, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (
      !form.name.trim() ||
      !form.estateId ||
      !form.description.trim() ||
      !picture ||
      price < 0 ||
      stock < 0
    ) {
      toast.warning("Enter the product details and a picture");
      return;
    }

    setSaving(true);
    try {
      const result = await createMarketplaceProduct({
        estateId: Number(form.estateId),
        name: form.name.trim(),
        category: form.category,
        price,
        stock,
        description: form.description.trim(),
        picture,
      });
      toast.success(result.message || "Product added");
      onCreated();
    } catch (saveError) {
      toast.error(
        saveError instanceof Error ? saveError.message : "Could not add product",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-[#272727]">Add product</h2>
            <p className="mt-1 text-sm text-[#767676]">
              List an item residents can order in an estate community.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <FaXmark />
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              className="h-11 w-full rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
            />
          </Field>
          <Field label="Category">
            <select
              value={form.category}
              onChange={(event) => update("category", event.target.value)}
              className="h-11 w-full rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </Field>
          <Field label="Price">
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(event) => update("price", event.target.value)}
              className="h-11 w-full rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
            />
          </Field>
          <Field label="Stock">
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(event) => update("stock", event.target.value)}
              className="h-11 w-full rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
            />
          </Field>
          <Field label="Estate community">
            <select
              value={form.estateId}
              onChange={(event) => update("estateId", event.target.value)}
              disabled={loadingEstates}
              className="h-11 w-full rounded-full bg-[#F6F6F8] px-4 text-sm outline-none"
            >
              {loadingEstates && <option value="">Loading estates</option>}
              {!loadingEstates && estates.length === 0 && (
                <option value="">No estates yet</option>
              )}
              {estates.map((estate) => (
                <option key={estate.id} value={estate.id}>
                  {estate.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Picture">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setPicture(event.target.files?.[0] || null)}
              className="h-11 w-full rounded-full bg-[#F6F6F8] px-4 py-2 text-sm outline-none"
            />
          </Field>
          <Field label="Description">
            <input
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              className="h-11 w-full rounded-full bg-[#F6F6F8] px-4 text-sm outline-none sm:col-span-2"
            />
          </Field>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full border border-gray-300 px-5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-11 rounded-full bg-[#79B833] px-5 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? "Saving" : "Save product"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-[#767676]">{label}</span>
      {children}
    </label>
  );
}
