# Tweakpane Texture2D Plugin

## Usage

```typescript
const pane = new Pane();
pane.registerPlugin(TexturePlugin);

pane.addBlade({
  view: "texture2d",
  engine: scene.engine,
  label: "texture",
  value: scene.background.texture,
  onUploaded(texture) {
    scene.background.texture = texture;
  },
  onPreview(ctx: CanvasRenderingContext2D) {
    rootStore.imagePreviewStore.show(ctx);
  },
});
```
