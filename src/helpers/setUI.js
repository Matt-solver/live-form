import comm from "../mixin/common";
export function setIDTypeRate(idType) {
  let self = this;
  /*  Screen Spec
   *포맷	       크기	            용도
   *ID-1	   85.60 × 53.98 mm	   대부분의 은행 카드와 ID 카드
   *ID-2	   105 × 74 mm	       프랑스 및 기타 ID 신분증, 비자
   *ID-3	   125 × 88 mm	       여권
   */
  switch (idType) {
    case "passport":
      // screen rate spec
      self.ID_type_Rate = 0.704;
      // face detector rate spec on the ID CARD
      self.x_rate_min = 0;
      self.x_rate_max = 0.1;
      self.y_rate_min = 0;
      self.y_rate_max = 0.15;
      self.min_width = 0.8;
      self.max_width = 1.0;
      self.min_height = 0.8;
      self.max_height = 1.0;
      // self.x_rate_min = 0.07; self.x_rate_max = 0.24
      // self.y_rate_min = 0.35; self.y_rate_max = 0.49
      // self.min_width  = 0.11; self.max_width  = 0.26
      // self.min_height = 0.11; self.max_height = 0.26
      break;
    case "government_ID":
      self.ID_type_Rate = 0.63;
      self.x_rate_min = 0;
      self.x_rate_max = 0.1;
      self.y_rate_min = 0;
      self.y_rate_max = 0.15;
      self.min_width = 0.8;
      self.max_width = 1.0;
      self.min_height = 0.8;
      self.max_height = 1.0;
      // self.x_rate_min = 0.58; self.x_rate_max = 0.73
      // self.y_rate_min = 0.35; self.y_rate_max = 0.49
      // self.min_width  = 0.11; self.max_width  = 0.26
      // self.min_height = 0.11; self.max_height = 0.6
      break;
    case "driver_license":
      self.ID_type_Rate = 0.63;
      self.x_rate_min = 0;
      self.x_rate_max = 0.1;
      self.y_rate_min = 0;
      self.y_rate_max = 0.15;
      self.min_width = 0.8;
      self.max_width = 1.0;
      self.min_height = 0.8;
      self.max_height = 1.0;
      // self.x_rate_min = 0.07; self.x_rate_max = 0.24
      // self.y_rate_min = 0.43; self.y_rate_max = 0.56
      // self.min_width  = 0.11; self.max_width  = 0.26
      // self.min_height = 0.11; self.max_height = 0.26
      break;
    default:
      comm.errorPage(self, 401);
      break;
  }
}
