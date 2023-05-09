import { useRootStore } from "@/store/RootStore";
import { Image } from "antd";
import { observer } from "mobx-react-lite";

export const ImagePreview = observer(function () {
  const { imagePreviewStore } = useRootStore();

  return (
    <Image
      width={200}
      style={{ display: "none" }}
      src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
      preview={{
        visible: imagePreviewStore.visible,
        src: imagePreviewStore.url,
        onVisibleChange: (value) => {
          if (!value) imagePreviewStore.hide();
        },
      }}
    />
  );
});
