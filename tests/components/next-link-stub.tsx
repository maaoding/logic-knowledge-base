// 组件测试专用：项目未安装 next 包（next/* 由 vinext 别名提供），
// vitest 里用最小说具替代 next/link 的客户端导航行为
export default function NextLinkStub({
  href,
  children,
  onClick,
  ...rest
}: {
  href: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  id?: string;
  role?: string;
  className?: string;
  "aria-selected"?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
  ref?: React.Ref<HTMLAnchorElement>;
}) {
  return (
    <a href={href} onClick={onClick} {...rest}>
      {children}
    </a>
  );
}
