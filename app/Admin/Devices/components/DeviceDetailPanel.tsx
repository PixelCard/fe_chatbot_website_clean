import type { DeviceItem } from "../types/device.types";
import DeviceInfoBox from "./DeviceInfoBox";
import DeviceRepairHistory from "./DeviceRepairHistory";

export default function DeviceDetailPanel({ device }: { device: DeviceItem }) {
  return (
    <div className="border-t border-[var(--admin-card-border)] bg-[var(--admin-card-soft-bg)] p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="admin-card rounded-2xl p-5">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--admin-strong-text)]">
            Thông tin thiết bị
          </h3>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <DeviceInfoBox label="Loại thiết bị" value={device.category} />
            <DeviceInfoBox label="Hãng" value={device.brandName} />
            <DeviceInfoBox
              label="Model"
              value={device.modelCode || "Chưa có"}
            />
            <DeviceInfoBox
              label="Vị trí đặt"
              value={device.location || "Chưa có"}
            />
            <DeviceInfoBox
              label="Ngày mua"
              value={device.purchaseDate || "Chưa có"}
            />
            <DeviceInfoBox
              label="Bảo hành"
              value={
                device.warrantyMonths !== null
                  ? `${device.warrantyMonths} tháng`
                  : "Chưa có"
              }
            />
            <DeviceInfoBox
              label="Chu kỳ bảo trì"
              value={
                device.maintenanceCycleMonths !== null
                  ? `${device.maintenanceCycleMonths} tháng/lần`
                  : "Chưa có"
              }
            />
            <DeviceInfoBox
              label="Ngày bảo trì tiếp theo"
              value={device.nextMaintenanceDate || "Chưa có"}
            />
          </div>
        </section>

        <section className="admin-card rounded-2xl p-5">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--admin-strong-text)]">
            Khách hàng
          </h3>

          <div className="mt-5 space-y-3">
            <DeviceInfoBox label="Tên khách hàng" value={device.userName} />
            <DeviceInfoBox label="Số điện thoại" value={device.userPhone} />
            <DeviceInfoBox label="User ID" value={`#${device.userId}`} />
          </div>
        </section>
      </div>

      <DeviceRepairHistory items={device.repairHistory} />
    </div>
  );
}