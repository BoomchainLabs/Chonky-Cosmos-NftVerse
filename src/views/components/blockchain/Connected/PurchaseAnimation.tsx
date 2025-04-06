import { Image } from "@0xsequence/design-system";
import "./PurchaseAnimation.css";

function PurchaseAnimation({
  amount,
  image,
  name,
}: {
  amount: number;
  image: string;
  name: string;
}) {
  return (
    <div>
      <div className="purchaseAnimation__purchase-div">
        <div className="purchaseAnimation__image-container">
          <Image src={image} alt={name} style={{ width: "4rem" }} />
        </div>
        <div className="purchaseAnimation__moving-text">
          Purchasing {amount} Chests
          <span className="purchaseAnimation__dot">.</span>
          <span
            className="purchaseAnimation__dot"
            style={{ animationDelay: "0.2s" }}
          >
            .
          </span>
          <span
            className="purchaseAnimation__dot"
            style={{ animationDelay: "0.4s" }}
          >
            .
          </span>
        </div>
      </div>
    </div>
  );
}

export default PurchaseAnimation;
