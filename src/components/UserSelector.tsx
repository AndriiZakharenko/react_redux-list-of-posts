import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import * as usersActions from '../features/users';
import { authorSlise } from '../features/author';
import { selectedPostSlice } from '../features/selectedPost';

export const UserSelector: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useAppDispatch();
  const { users } = useAppSelector(state => state.users);
  const { author } = useAppSelector(state => state.author);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const handleDocumentClick = () => {
      setExpanded(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [expanded]);

  useEffect(() => {
    dispatch(usersActions.init());
  }, [dispatch]);

  return (
    <div
      data-cy="UserSelector"
      className={classNames('dropdown', { 'is-active': expanded })}
    >
      <div className="dropdown-trigger">
        <button
          type="button"
          className="button"
          aria-haspopup="true"
          aria-controls="dropdown-menu"
          onClick={e => {
            e.stopPropagation();
            setExpanded(current => !current);
          }}
        >
          <span>{author?.name || 'Choose a user'}</span>

          <span className="icon is-small">
            <i className="fas fa-angle-down" aria-hidden="true" />
          </span>
        </button>
      </div>

      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {users.length > 0 ? (
            users.map(user => (
              <a
                key={user.id}
                href={`#user-${user.id}`}
                onClick={() => {
                  dispatch(authorSlise.actions.add(user));
                  dispatch(selectedPostSlice.actions.add(null));
                }}
                className={classNames('dropdown-item', {
                  'is-active': user.id === author?.id,
                })}
              >
                {user.name}
              </a>
            ))
          ) : (
            <div>No users available</div>
          )}
        </div>
      </div>

      {!author && (
        <div className="notification is-warning" data-cy="NoSelectedUser">
          No user selected. Please choose a user.
        </div>
      )}
    </div>
  );
};