import { Div } from "@ssr-tools/css/stylable/Div";
import { Print } from "../components/Print";
import { A } from "../config/router";

export const HashScrollPage = () => {
  return (
    <Div
      css={{
        "&": {
          maxWidth: "80ch",
        },
      }}
    >
      <Print text="Hash scroll" />
      <p>This page demonstrates how the hash scroll works.</p>
      <ul>
        <li>
          <A
            pathPattern="/hash-scroll"
            hash="section-one"
            data-test-id="section-one-link"
          >
            Section one
          </A>
        </li>
        <li>
          <A
            pathPattern="/hash-scroll"
            hash="section-two"
            data-test-id="section-two-link"
          >
            Section two
          </A>
        </li>
        <li>
          <A
            pathPattern="/hash-scroll"
            hash="section-three"
            data-test-id="section-three-link"
          >
            Section three
          </A>
        </li>
      </ul>
      <h2 id="section-one">Section one</h2>
      <p>{lipsum}</p>
      <p>{lipsum}</p>
      <p>{lipsum}</p>
      <h2 id="section-two">Section two</h2>
      <p>{lipsum}</p>
      <p>{lipsum}</p>
      <p>{lipsum}</p>
      <h3 id="section-three">Section three</h3>
      <p>{lipsum}</p>
      <p>{lipsum}</p>
      <p>{lipsum}</p>
    </Div>
  );
};

const lipsum =
  // eslint-disable-next-line max-len
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ullamcorper vitae lacus in cursus. Curabitur lobortis leo quis nunc dapibus, ac ornare sem fermentum. Sed tristique ligula eget ullamcorper egestas. Fusce urna lacus, bibendum vitae bibendum eu, scelerisque ac purus. Curabitur tortor ante, semper non volutpat lobortis, mollis vitae enim. Nam ultrices, ex ac condimentum pellentesque, risus sem eleifend lacus, non facilisis neque nunc sit amet tellus. Nulla dapibus justo ut urna ultrices semper. Fusce leo justo, sodales at condimentum sit amet, maximus at dolor. Mauris tortor augue, faucibus eget sem vel, eleifend tincidunt magna. Donec consequat mauris quis vehicula egestas. In hac habitasse platea dictumst. Aliquam interdum elit a fringilla consequat. ";
