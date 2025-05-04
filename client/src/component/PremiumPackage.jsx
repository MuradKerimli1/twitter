import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Axios } from "../lib/axios";
import { summaryApi } from "../config/summaryApi";
import { setPackages } from "../store/slices/auth.slice";
import { axiosError } from "../error/axiosError";
import { FaCrown, FaCheck, FaClock, FaEllipsisV } from "react-icons/fa";
import CreatePackage from "./CreatePackage";
import UpdatePackage from "./UpdatePackage";

const PremiumPackage = () => {
  const { user, packages } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [packageToUpdate, setPackageToUpdate] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPackages = async () => {
      setLoading(true);
      try {
        const response = await Axios({ ...summaryApi.fetchPackages });
        if (response.data.success) {
          dispatch(setPackages(response.data.packages));
        }
      } catch (err) {
        setError(err.message);
        axiosError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [dispatch]);

  const handleDeletePackage = async (id) => {
    setLoading(true);
    try {
      const res = await Axios({ ...summaryApi.deletePackage(id) });
      if (res.data.success) {
        const updatedPackages = packages.filter((pkg) => pkg.id !== id);
        dispatch(setPackages(updatedPackages));
      }
    } catch (err) {
      setError(err.message);
      axiosError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 h-screen overflow-y-auto">
      {loading && (
        <div className="flex items-center justify-center my-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error max-w-md mx-auto my-8">
          <span>{error}</span>
        </div>
      )}

      {!loading && packages.length === 0 && (
        <div className="text-center my-8">
          <FaCrown className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-500">Henüz paket yok</h3>
          <p className="text-gray-400 mt-2">
            Premium paketler yakında eklenecek
          </p>
        </div>
      )}

      {!loading && packages.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Premium Paketler</h2>
            <p className="text-gray-500">
              Özel avantajlardan yararlanmak için paketinizi seçin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="card bg-[#202327] cursor-pointer font-semibold shadow-md hover:border-primary hover:shadow-lg transition-all duration-300 min-h-[400px] flex flex-col relative"
              >
                <div className="card-body flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaCrown className="text-2xl text-yellow-500 mr-2" />
                      <h3 className="card-title text-xl font-bold">
                        {pkg.name}
                      </h3>
                    </div>

                    {user.role === "ADMIN" && (
                      <div className="relative ">
                        <button
                          onClick={() =>
                            setMenuOpenId((prev) =>
                              prev === pkg.id ? null : pkg.id
                            )
                          }
                          className="text-gray-400 hover:text-white  cursor-pointer"
                        >
                          <FaEllipsisV />
                        </button>

                        {menuOpenId === pkg.id && (
                          <div className="absolute cursor-pointer right-0 top-8 bg-[#2F3336] border border-[#3C4043] rounded-lg z-50 w-32 shadow-lg">
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                setPackageToUpdate(pkg);
                                setOpenUpdate((prev) => !prev);
                              }}
                              className="block cursor-pointer w-full px-4 py-2 text-left text-sm text-white hover:bg-[#3A3F44]"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => {
                                setMenuOpenId(null);
                                handleDeletePackage(pkg.id);
                              }}
                              className="block cursor-pointer w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-[#3A3F44]"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-3xl font-bold text-primary">
                      {pkg.price} {pkg.currency}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center">
                      <FaClock className="text-gray-500 mr-2" />
                      <span>{pkg.durationInDays} gün geçerli</span>
                    </div>
                    {pkg.features?.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <FaCheck className="text-green-500 mr-2" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {pkg.description && (
                    <div className="text-sm text-gray-500 mb-6">
                      {pkg.description}
                    </div>
                  )}

                  <div className="card-actions justify-end mt-auto">
                    <button className="btn btn-primary w-full">Satın Al</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {user.role === "ADMIN" && (
            <div className="w-full mt-5">
              <button
                onClick={() => setOpenCreate((prev) => !prev)}
                className="w-full btn btn-primary text-center"
              >
                Create
              </button>
            </div>
          )}
        </div>
      )}

      {openCreate && <CreatePackage close={() => setOpenCreate(false)} />}
      {openUpdate && (
        <UpdatePackage
          close={() => setOpenUpdate(false)}
          data={packageToUpdate}
        />
      )}
    </div>
  );
};

export default PremiumPackage;
