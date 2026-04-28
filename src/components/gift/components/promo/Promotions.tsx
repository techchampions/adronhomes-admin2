// Promotions.tsx - Main Dashboard Component
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../../../general/Header";
import { ExportModalRef } from "../../../exportModal/modalexport";
import { MatrixCardGreen, MatrixCard } from "../../../firstcard";
import LoadingAnimations from "../../../LoadingAnimations";
import { fetchPromos, selectPromosLoading, selectPromosStats } from "../../../Redux/gift/promo/promoSlice";
import { resetPromosTable, setPromosSearch } from "../../../Redux/gift/promo/promoTableSlice";
import { AppDispatch, RootState } from "../../../Redux/store";
import { ReusableTable } from "../../../Tables/Table_one";
import PromotionsTableComponent from "./PromotionsTableComponent";


export default function Promotions() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { promos, loading, error, pagination, search } = useSelector(
    (state: RootState) => state.promoTable,
  );
  
  const tabs = ["Promotions"
  ];
  const [sort, setSort] = React.useState<string>("newest");

  useEffect(() => {
    dispatch(fetchPromos({ 
      page: pagination.currentPage, 
      search, 
      sort_by: sort 
    }));
  }, [dispatch, pagination.currentPage, search, sort]);

  useEffect(() => {
    return () => {
      dispatch(resetPromosTable());
      dispatch(setPromosSearch(""));
    };
  }, [dispatch]);

  const promosModalRef = useRef<ExportModalRef>(null);
  const openPromosModal = () => {
    if (promosModalRef.current) {
      promosModalRef.current.openModal();
    }
  };

    const stats = useSelector(selectPromosStats);

//   const sortOptions = [
//     { value: "newest", name: "Sort by Newest" },
//     { value: "oldest", name: "Sort by Oldest" },
//     { value: "most_tiers", name: "Sort by Most Tiers" },
//     { value: "most_properties", name: "Sort by Most Properties" },
//   ];

  const handleCreatePromo = () => {
    navigate("/promotions/create");
  };

  return (
    <div className="pb-[52px] relative">
      <Header
        title="Promotions"
        subtitle="Manage all promotional campaigns and tiered rewards"
        buttonText="Create Promotion"
        onButtonClick={handleCreatePromo}
      />
      
      <div className="grid md:grid-cols-4 gap-[20px] lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px] mb-[30px]">
        <MatrixCardGreen
          title="Total Promotions"
          change="All active and inactive promotions"
          value={stats?.total_promotions || 0}
        />
        
        <MatrixCard
          title="Total Tiers"
          value={stats?.total_tiers || 0}
          change="Total reward tiers across all promotions"
        />
        
        <MatrixCard
          title="Total Properties"
          value={stats?.total_properties || 0}
          change="Properties with active promotions"
        />
        
        <MatrixCard
          title="Active Promotions"
          value={stats?.active_promotions || 0}
          change="Currently running promotions"
        />
      </div>
      
      <div className="lg:pl-[38px] lg:pr-[68px] pl-[15px] pr-[15px]">
        <ReusableTable
          onSortChange={(sortOption) => {
            setSort(sortOption.value);
          }}
        //   sortOptions={sortOptions.map((option) => ({
        //     value: option.value,
        //     name: option.name,
        //   }))}
        //   defaultSort={sortOptions.findIndex((option) => option.value === sort) || 0}
          tabs={tabs}
        //   sort={true}
          searchPlaceholder={"Search promotions by name..."}
          activeTab={"Promotions"}
          onSearch={(value) => dispatch(setPromosSearch(value))}
        >
          {loading ? (
            <LoadingAnimations loading={loading} />
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              Error loading promotions: {error}
            </div>
          ) : (
            <PromotionsTableComponent />
          )}
        </ReusableTable>
      </div>
 
    </div>
  );
}