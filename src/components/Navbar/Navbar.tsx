import AuthenticatedNotificationBell from "@/components/NotificationBell/AuthenticatedNotificationBell";
import { logger } from "@/utils/logger";

interface NavbarProps {
  isCollapsed: boolean;
}

const Navbar = ({ isCollapsed }: NavbarProps) => {
  logger.debug("Navbar", `Rendering collapsed ${isCollapsed}}`);
  return (
    <div className="h-16 border-b border-gray-700 bg-gray-800 flex items-center">
      <div className="px-4">
        <AuthenticatedNotificationBell />
      </div>
    </div>
  );
};

export default Navbar;
